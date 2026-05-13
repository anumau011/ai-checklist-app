import express from 'express'
import { Checklist } from '../models/Checklist.js'
import { authenticateToken } from '../middleware/auth.js'
import { generateQuestions, generateChecklist } from '../services/geminiService.js'

const router = express.Router()

// Generate questions
router.post('/questions', authenticateToken, async (req, res) => {
  try {
    const { topic } = req.body

    if (!topic) {
      return res.status(400).json({ message: 'Topic is required' })
    }

    const questions = await generateQuestions(topic)
    res.json({ questions })
  } catch (error) {
    console.error('Error generating questions:', error)
    res.status(500).json({ message: 'Failed to generate questions', error: error.message })
  }
})

// Generate checklist
router.post('/generate', authenticateToken, async (req, res) => {
  try {
    const { topic, answers } = req.body

    if (!topic || !answers) {
      return res.status(400).json({ message: 'Topic and answers are required' })
    }

    // Generate checklist using Gemini
    const generatedChecklist = await generateChecklist(topic, answers)

    // Create checklist in database
    const checklist = new Checklist({
      userId: req.userId,
      title: generatedChecklist.title,
      subtitle: generatedChecklist.subtitle,
      sections: generatedChecklist.sections.map((sec) => ({
        title: sec.title,
        items: sec.items.map((text) => ({ text, done: false })),
      })),
    })

    await checklist.save()

    res.status(201).json(checklist)
  } catch (error) {
    console.error('Error generating checklist:', error)
    res.status(500).json({ message: 'Failed to generate checklist', error: error.message })
  }
})

// Get all checklists for user
router.get('/all', authenticateToken, async (req, res) => {
  try {
    const checklists = await Checklist.find({ userId: req.userId })
      .sort({ createdAt: -1 })

    res.json({ checklists })
  } catch (error) {
    console.error('Error fetching checklists:', error)
    res.status(500).json({ message: 'Failed to fetch checklists' })
  }
})

// Get specific checklist
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const checklist = await Checklist.findOne({
      _id: req.params.id,
      userId: req.userId,
    })

    if (!checklist) {
      return res.status(404).json({ message: 'Checklist not found' })
    }

    res.json(checklist)
  } catch (error) {
    console.error('Error fetching checklist:', error)
    res.status(500).json({ message: 'Failed to fetch checklist' })
  }
})

// Update checklist
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { sections, title, subtitle } = req.body

    const checklist = await Checklist.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      {
        ...(title && { title }),
        ...(subtitle && { subtitle }),
        ...(sections && { sections }),
        updatedAt: new Date(),
      },
      { new: true }
    )

    if (!checklist) {
      return res.status(404).json({ message: 'Checklist not found' })
    }

    res.json(checklist)
  } catch (error) {
    console.error('Error updating checklist:', error)
    res.status(500).json({ message: 'Failed to update checklist' })
  }
})

// Update item in checklist
router.put('/:id/item', authenticateToken, async (req, res) => {
  try {
    const { sectionId, itemId, done } = req.body

    const checklist = await Checklist.findOne({
      _id: req.params.id,
      userId: req.userId,
    })

    if (!checklist) {
      return res.status(404).json({ message: 'Checklist not found' })
    }

    // Find and update item
    const section = checklist.sections.id(sectionId)
    if (!section) {
      return res.status(404).json({ message: 'Section not found' })
    }

    const item = section.items.id(itemId)
    if (!item) {
      return res.status(404).json({ message: 'Item not found' })
    }

    item.done = done
    checklist.updatedAt = new Date()
    await checklist.save()

    res.json(checklist)
  } catch (error) {
    console.error('Error updating item:', error)
    res.status(500).json({ message: 'Failed to update item' })
  }
})

// Delete checklist
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const checklist = await Checklist.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    })

    if (!checklist) {
      return res.status(404).json({ message: 'Checklist not found' })
    }

    res.json({ message: 'Checklist deleted' })
  } catch (error) {
    console.error('Error deleting checklist:', error)
    res.status(500).json({ message: 'Failed to delete checklist' })
  }
})

export default router

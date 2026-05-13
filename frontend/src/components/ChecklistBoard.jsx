import React, { useState, useEffect } from 'react'
import { checklistAPI } from '../api/client'
import SectionCard from './SectionCard'
import '../styles/ChecklistBoard.css'

function ChecklistBoard({ checklist, onReset, onUpdate }) {
  const [currentChecklist, setCurrentChecklist] = useState(checklist)
  const [newSectionTitle, setNewSectionTitle] = useState('')

  const calculateProgress = () => {
    const total = currentChecklist.sections.reduce((acc, sec) => acc + sec.items.length, 0)
    const done = currentChecklist.sections.reduce(
      (acc, sec) => acc + sec.items.filter(it => it.done).length,
      0
    )
    return total ? Math.round((done / total) * 100) : 0
  }

  const getTotalItems = () => {
    return currentChecklist.sections.reduce((acc, sec) => acc + sec.items.length, 0)
  }

  const getDoneItems = () => {
    return currentChecklist.sections.reduce(
      (acc, sec) => acc + sec.items.filter(it => it.done).length,
      0
    )
  }

  const handleToggleItem = async (sectionId, itemId) => {
    try {
      const section = currentChecklist.sections.find(s => s._id === sectionId)
      const item = section.items.find(i => i._id === itemId)
      const newDone = !item.done

      await checklistAPI.updateItem(currentChecklist._id, sectionId, itemId, newDone)

      setCurrentChecklist(prev => ({
        ...prev,
        sections: prev.sections.map(sec =>
          sec._id === sectionId
            ? {
                ...sec,
                items: sec.items.map(it =>
                  it._id === itemId ? { ...it, done: newDone } : it
                )
              }
            : sec
        )
      }))

      if (onUpdate) onUpdate()
    } catch (error) {
      console.error('Failed to update item:', error)
    }
  }

  const handleAddSection = async (e) => {
    if (e.key === 'Enter' && newSectionTitle.trim()) {
      try {
        const updated = await checklistAPI.updateChecklist(currentChecklist._id, {
          sections: [
            ...currentChecklist.sections,
            { title: newSectionTitle, items: [] }
          ]
        })
        setCurrentChecklist(updated.data)
        setNewSectionTitle('')
        if (onUpdate) onUpdate()
      } catch (error) {
        console.error('Failed to add section:', error)
      }
    }
  }

  const handleResetBoard = async () => {
    try {
      const updated = await checklistAPI.updateChecklist(currentChecklist._id, {
        sections: currentChecklist.sections.map(sec => ({
          ...sec,
          items: sec.items.map(it => ({ ...it, done: false }))
        }))
      })
      setCurrentChecklist(updated.data)
      if (onUpdate) onUpdate()
    } catch (error) {
      console.error('Failed to reset board:', error)
    }
  }

  const progress = calculateProgress()
  const total = getTotalItems()
  const done = getDoneItems()

  return (
    <div className="checklist-board">
      <div className="board-header">
        <div className="board-title-row">
          <h2>{currentChecklist.title}</h2>
          <p>{currentChecklist.subtitle}</p>
        </div>
        <div className="board-actions">
          <button className="btn-ghost" onClick={handleResetBoard}>
            Reset all
          </button>
          <button className="btn-primary" onClick={onReset}>
            Back
          </button>
        </div>
      </div>

      <div className="progress-wrap">
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${progress}%` }}></div>
        </div>
        <div className="progress-label">
          {done} of {total} items completed · {progress}%
        </div>
      </div>

      <div className="sections-grid">
        {currentChecklist.sections.map(section => (
          <SectionCard
            key={section._id}
            section={section}
            checklistId={currentChecklist._id}
            onToggleItem={handleToggleItem}
            onUpdate={onUpdate}
          />
        ))}
      </div>

      <div className="add-sec-row">
        <input
          className="add-sec-input"
          value={newSectionTitle}
          onChange={(e) => setNewSectionTitle(e.target.value)}
          onKeyDown={handleAddSection}
          placeholder="Add a new section…"
        />
        <button className="btn-primary" onClick={(e) => handleAddSection({ key: 'Enter' })}>
          + Section
        </button>
      </div>
    </div>
  )
}

export default ChecklistBoard

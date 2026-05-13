import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

export const generateQuestions = async (topic) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

    const prompt = `You generate clarifying questions to tailor a checklist. Respond ONLY with valid JSON array, no markdown, no extra text. Format: [{"question":"...","options":["opt1","opt2","opt3","opt4"]}]. Generate exactly 3 questions. Make options specific and useful, 3-5 options each. No preamble, no explanation.

Topic: ${topic}`

    const result = await model.generateContent(prompt)
    const responseText = result.response.text()
    
    // Clean up JSON response
    const cleanJson = responseText.replace(/```json|```/g, '').trim()
    const questions = JSON.parse(cleanJson)
    
    return questions
  } catch (error) {
    console.error('Error generating questions:', error)
    throw error
  }
}

export const generateChecklist = async (topic, answers) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

    const context = answers.map((a) => `Q: ${a.q}\nA: ${a.a}`).join('\n')

    const prompt = `You create structured checklists. Respond ONLY with valid JSON, no markdown, no extra text. Format: {"title":"...","subtitle":"...","sections":[{"title":"...","items":["item1","item2",...]}]}. Create 4-6 sections with 4-8 items each. Items should be actionable, specific, and concise (under 12 words). No preamble, no explanation, just JSON.

Create a checklist for: ${topic}

User preferences:
${context}`

    const result = await model.generateContent(prompt)
    const responseText = result.response.text()
    
    // Clean up JSON response
    const cleanJson = responseText.replace(/```json|```/g, '').trim()
    const checklist = JSON.parse(cleanJson)
    
    return checklist
  } catch (error) {
    console.error('Error generating checklist:', error)
    throw error
  }
}

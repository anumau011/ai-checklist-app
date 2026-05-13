import React, { useState, useEffect, useRef } from 'react'
import { checklistAPI } from '../api/client'
import '../styles/WizardChat.css'

function WizardChat({ topic, onChecklistGenerated }) {
  const [messages, setMessages] = useState([])
  const [questions, setQuestions] = useState([])
  const [answers, setAnswers] = useState([])
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0)
  const [selectedOption, setSelectedOption] = useState(null)
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const chatAreaRef = useRef(null)

  useEffect(() => {
    initializeWizard()
  }, [])

  useEffect(() => {
    if (chatAreaRef.current) {
      chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight
    }
  }, [messages])

  const initializeWizard = async () => {
    try {
      setLoading(true)
      addMessage('ai', `Got it — I'll create a checklist for <strong>${topic}</strong>. Let me ask a few questions first to tailor it for you.`)
      
      const response = await checklistAPI.generateQuestions(topic)
      setQuestions(response.data.questions)
      
      // Ask first question
      if (response.data.questions.length > 0) {
        addMessage('ai', response.data.questions[0].question)
      }
    } catch (error) {
      addMessage('ai', 'Failed to generate questions. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const addMessage = (role, content) => {
    setMessages(prev => [...prev, { role, content }])
  }

  const handleSelectOption = (option) => {
    setSelectedOption(option)
  }

  const handleNext = async () => {
    if (!selectedOption) return

    const currentQuestion = questions[currentQuestionIdx]
    addMessage('user', selectedOption)
    
    const newAnswers = [...answers, { q: currentQuestion.question, a: selectedOption }]
    setAnswers(newAnswers)
    setSelectedOption(null)

    const isLast = currentQuestionIdx === questions.length - 1

    if (isLast) {
      // Generate checklist
      try {
        setGenerating(true)
        const response = await checklistAPI.generateChecklist(topic, newAnswers)
        addMessage('ai', `Done! Your <strong>${response.data.title}</strong> checklist is ready with ${response.data.sections.length} sections. You can check off items and customize everything below.`)
        onChecklistGenerated(response.data)
      } catch (error) {
        addMessage('ai', 'Failed to generate checklist. Please try again.')
      } finally {
        setGenerating(false)
      }
    } else {
      // Ask next question
      const nextIdx = currentQuestionIdx + 1
      setCurrentQuestionIdx(nextIdx)
      addMessage('ai', questions[nextIdx].question)
    }
  }

  const handleBack = () => {
    if (currentQuestionIdx > 0) {
      const newAnswers = answers.slice(0, -1)
      setAnswers(newAnswers)
      setSelectedOption(null)
      
      const prevIdx = currentQuestionIdx - 1
      setCurrentQuestionIdx(prevIdx)
      
      // Remove last 2 messages (user answer and AI question)
      setMessages(prev => prev.slice(0, -2))
      
      // Re-show previous question
      addMessage('ai', questions[prevIdx].question)
    }
  }

  const currentQuestion = questions[currentQuestionIdx]
  const options = currentQuestion?.options || []

  return (
    <div className="wizard-container">
      <div className="wizard-wrap">
        <div className="chat-area" ref={chatAreaRef}>
          {messages.map((msg, idx) => (
            <div key={idx} className={`msg msg-${msg.role}`}>
              <div className={`avatar avatar-${msg.role}`}>
                {msg.role === 'ai' ? 'AI' : 'You'}
              </div>
              <div className="bubble" dangerouslySetInnerHTML={{ __html: msg.content }} />
            </div>
          ))}
          {loading && <div className="loading-msg">
            <div className="dots"><span></span><span></span><span></span></div> Thinking…
          </div>}
          {generating && <div className="loading-msg">
            <div className="dots"><span></span><span></span><span></span></div> Generating checklist…
          </div>}
        </div>

        {!loading && !generating && currentQuestion && (
          <>
            <div className="options-bar">
              {options.map((option) => (
                <button
                  key={option}
                  className={`opt-chip ${selectedOption === option ? 'sel' : ''}`}
                  onClick={() => handleSelectOption(option)}
                >
                  {option}
                </button>
              ))}
            </div>

            <div className="generate-bar">
              {currentQuestionIdx > 0 && (
                <button className="btn-ghost" onClick={handleBack}>
                  ← Back
                </button>
              )}
              <button
                className="btn-primary"
                onClick={handleNext}
                disabled={!selectedOption}
              >
                {currentQuestionIdx === questions.length - 1
                  ? 'Generate checklist →'
                  : 'Next →'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default WizardChat

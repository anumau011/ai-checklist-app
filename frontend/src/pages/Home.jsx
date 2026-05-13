import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import WizardChat from '../components/WizardChat'
import ChecklistBoard from '../components/ChecklistBoard'
import QuickTopics from '../components/QuickTopics'
import '../styles/Home.css'

function Home() {
  const navigate = useNavigate()
  const [topic, setTopic] = useState('')
  const [showWizard, setShowWizard] = useState(false)
  const [wizardData, setWizardData] = useState(null)

  const handleStartWizard = (selectedTopic) => {
    setTopic(selectedTopic)
    setShowWizard(true)
    setWizardData(null)
  }

  const handleChecklistGenerated = (data) => {
    setWizardData(data)
  }

  const handleReset = () => {
    setTopic('')
    setShowWizard(false)
    setWizardData(null)
  }

  return (
    <div className="home-page">
      {!showWizard && !wizardData ? (
        <div className="home-intro">
          <div className="home-top">
            <h1>What do you want a checklist for?</h1>
            <p>Enter any topic — AI will ask a few questions, then generate a structured checklist tailored to you.</p>
          </div>
          <div className="topic-box">
            <div className="topic-row">
              <input
                className="topic-input"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Java learning, React performance, Docker deployment…"
                onKeyDown={(e) => e.key === 'Enter' && handleStartWizard(topic)}
              />
              <button className="btn-primary" onClick={() => handleStartWizard(topic)}>
                Start →
              </button>
            </div>
            <QuickTopics onSelectTopic={handleStartWizard} />
          </div>
        </div>
      ) : null}

      {showWizard && !wizardData && (
        <WizardChat topic={topic} onChecklistGenerated={handleChecklistGenerated} />
      )}

      {wizardData && (
        <ChecklistBoard checklist={wizardData} onReset={handleReset} />
      )}
    </div>
  )
}

export default Home

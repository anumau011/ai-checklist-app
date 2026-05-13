import React from 'react'
import '../styles/QuickTopics.css'

function QuickTopics({ onSelectTopic }) {
  const topics = [
    'Java learning',
    'Node.js production readiness',
    'React best practices',
    'System design interview prep',
    'Docker & Kubernetes',
    'Python development',
    'Database design',
    'Security audit',
    'Pre-project planning'
  ]

  return (
    <div className="quick-topics-section">
      <div style={{ fontSize: '12px', color: '#888', marginBottom: '10px' }}>
        Quick picks:
      </div>
      <div className="quick-topics">
        {topics.map((topic) => (
          <span
            key={topic}
            className="quick-chip"
            onClick={() => onSelectTopic(topic)}
          >
            {topic}
          </span>
        ))}
      </div>
    </div>
  )
}

export default QuickTopics

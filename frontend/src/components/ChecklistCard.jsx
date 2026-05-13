import React from 'react'
import '../styles/ChecklistCard.css'

function ChecklistCard({ checklist, onSelect, onDelete }) {
  const total = checklist.sections.reduce((acc, sec) => acc + sec.items.length, 0)
  const done = checklist.sections.reduce(
    (acc, sec) => acc + sec.items.filter(it => it.done).length,
    0
  )
  const progress = total ? Math.round((done / total) * 100) : 0
  const date = new Date(checklist.createdAt).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short'
  })

  return (
    <div className="my-card">
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '4px' }}>
        <div className="my-card-title">{checklist.title}</div>
        <button
          onClick={(e) => {
            e.stopPropagation()
            onDelete()
          }}
          style={{
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            color: '#ccc',
            fontSize: '16px',
            lineHeight: '1',
            padding: '0 0 0 8px'
          }}
        >
          ✕
        </button>
      </div>
      <div className="my-card-sub">{checklist.subtitle}</div>
      <div className="my-progress-track">
        <div className="my-progress-fill" style={{ width: `${progress}%` }}></div>
      </div>
      <div className="my-card-foot">
        <span>{done}/{total} done</span>
        <span>{date}</span>
      </div>
      <button
        className="btn-primary"
        onClick={onSelect}
        style={{ width: '100%', marginTop: '12px' }}
      >
        Open
      </button>
    </div>
  )
}

export default ChecklistCard

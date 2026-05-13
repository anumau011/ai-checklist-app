import React, { useState } from 'react'
import { checklistAPI } from '../api/client'
import '../styles/SectionCard.css'

function SectionCard({ section, checklistId, onToggleItem, onUpdate }) {
  const [newItemText, setNewItemText] = useState('')

  const doneCount = section.items.filter(i => i.done).length

  const handleAddItem = async (e) => {
    if (e.key === 'Enter' && newItemText.trim()) {
      try {
        const updated = await checklistAPI.updateChecklist(checklistId, {
          sections: [section]
        })
        setNewItemText('')
        if (onUpdate) onUpdate()
      } catch (error) {
        console.error('Failed to add item:', error)
      }
    }
  }

  return (
    <div className="section-card">
      <div className="sec-head">
        <h3 className="sec-title">{section.title}</h3>
        <span className="sec-count">
          {doneCount}/{section.items.length}
        </span>
      </div>

      <div className="sec-body">
        {section.items.map(item => (
          <div key={item._id} className="item-row">
            <div
              className={`checkbox ${item.done ? 'done' : ''}`}
              onClick={() => onToggleItem(section._id, item._id)}
            ></div>
            <input
              className={`item-label ${item.done ? 'done' : ''}`}
              value={item.text}
              readOnly
            />
          </div>
        ))}

        <div className="add-item-row">
          <input
            className="add-item-input"
            value={newItemText}
            onChange={(e) => setNewItemText(e.target.value)}
            onKeyDown={handleAddItem}
            placeholder="Add item…"
          />
          <button className="add-item-btn">+</button>
        </div>
      </div>
    </div>
  )
}

export default SectionCard

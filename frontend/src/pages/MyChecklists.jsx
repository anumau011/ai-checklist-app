import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { checklistAPI } from '../api/client'
import ChecklistCard from '../components/ChecklistCard'
import ChecklistBoard from '../components/ChecklistBoard'
import '../styles/MyChecklists.css'

function MyChecklists() {
  const navigate = useNavigate()
  const [checklists, setChecklists] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedId, setSelectedId] = useState(null)

  useEffect(() => {
    fetchChecklists()
  }, [])

  const fetchChecklists = async () => {
    try {
      setLoading(true)
      const response = await checklistAPI.getAllChecklists()
      setChecklists(response.data.checklists)
      setError(null)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load checklists')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      await checklistAPI.deleteChecklist(id)
      setChecklists(checklists.filter(cl => cl._id !== id))
      setError(null)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete checklist')
    }
  }

  const selectedChecklist = checklists.find(cl => cl._id === selectedId)

  if (selectedChecklist) {
    return (
      <ChecklistBoard
        checklist={selectedChecklist}
        onReset={() => setSelectedId(null)}
        onUpdate={fetchChecklists}
      />
    )
  }

  if (loading) return <div className="loading">Loading checklists...</div>

  return (
    <div className="my-checklists">
      <div className="my-header">
        <div>
          <h2>My checklists</h2>
          <p>All your saved checklists, with progress tracking</p>
        </div>
        <button className="btn-primary" onClick={() => navigate('/')}>
          + New checklist
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {checklists.length === 0 ? (
        <div className="empty-state">
          <div className="icon">📋</div>
          <p>No checklists yet.<br />Create your first one!</p>
        </div>
      ) : (
        <div className="my-grid">
          {checklists.map((cl) => (
            <ChecklistCard
              key={cl._id}
              checklist={cl}
              onSelect={() => setSelectedId(cl._id)}
              onDelete={() => handleDelete(cl._id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default MyChecklists

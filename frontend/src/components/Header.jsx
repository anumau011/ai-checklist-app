import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import '../styles/Header.css'

function Header() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="app-header">
      <div className="header-left">
        <div className="logo">
          <div className="logo-dot">✓</div>
          <span>AI Checklist</span>
        </div>
      </div>

      <nav className="nav-pills">
        <button className="nav-pill active" onClick={() => navigate('/')}>
          Create
        </button>
        <button className="nav-pill" onClick={() => navigate('/my-checklists')}>
          My checklists
        </button>
      </nav>

      <div className="header-right">
        <span className="user-email">{user?.email}</span>
        <button className="btn-logout" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </header>
  )
}

export default Header

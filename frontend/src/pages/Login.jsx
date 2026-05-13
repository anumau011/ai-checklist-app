import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import '../styles/Auth.css'

function Login() {
  const navigate = useNavigate()
  const { login, register, error } = useAuth()
  const [isSignup, setIsSignup] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [localError, setLocalError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLocalError('')

    try {
      setLoading(true)
      
      if (isSignup) {
        if (password !== confirmPassword) {
          setLocalError('Passwords do not match')
          return
        }
        if (password.length < 6) {
          setLocalError('Password must be at least 6 characters')
          return
        }
        await register(email, password)
      } else {
        await login(email, password)
      }
      
      navigate('/')
    } catch (err) {
      setLocalError(err.response?.data?.message || 'Authentication failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">✓</div>
          <h1>AI Checklist</h1>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <h2>{isSignup ? 'Create Account' : 'Sign In'}</h2>

          {(error || localError) && (
            <div className="error-message">{error || localError}</div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          {isSignup && (
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
          )}

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Loading...' : isSignup ? 'Create Account' : 'Sign In'}
          </button>

          <div className="auth-toggle">
            <span>{isSignup ? 'Already have an account?' : "Don't have an account?"}</span>
            <button
              type="button"
              onClick={() => setIsSignup(!isSignup)}
              className="toggle-link"
            >
              {isSignup ? 'Sign In' : 'Sign Up'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login

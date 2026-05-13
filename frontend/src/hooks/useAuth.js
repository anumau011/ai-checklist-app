import { useState, useEffect } from 'react'
import { authAPI } from '../api/client'

export const useAuth = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem('token')
      if (!token) {
        setLoading(false)
        return
      }

      try {
        const response = await authAPI.validateToken()
        setUser(response.data.user)
        setError(null)
      } catch (err) {
        localStorage.removeItem('token')
        setUser(null)
        setError(err.response?.data?.message || 'Failed to validate token')
      } finally {
        setLoading(false)
      }
    }

    validateToken()
  }, [])

  const login = async (email, password) => {
    try {
      setLoading(true)
      const response = await authAPI.login(email, password)
      localStorage.setItem('token', response.data.token)
      setUser(response.data.user)
      setError(null)
      return response.data
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const register = async (email, password) => {
    try {
      setLoading(true)
      const response = await authAPI.register(email, password)
      localStorage.setItem('token', response.data.token)
      setUser(response.data.user)
      setError(null)
      return response.data
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    authAPI.logout()
    setUser(null)
    setError(null)
  }

  return { user, loading, error, login, register, logout }
}

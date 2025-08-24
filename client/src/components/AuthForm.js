'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Dashboard from './Dashboard'
import './AuthForm.css'

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(null) // null = no modal, true = sign in, false = sign up
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [currentUser, setCurrentUser] = useState(null)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    const user = localStorage.getItem('user')
    
    if (token && user) {
      const userData = JSON.parse(user)
      setCurrentUser(userData)
    }
  }, [router])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register'
      const payload = isLogin 
        ? { email: formData.email, password: formData.password }
        : { name: formData.name, username: formData.username, email: formData.email, password: formData.password }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://looklyy.onrender.com'}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong')
      }

      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      setCurrentUser(data.user)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (currentUser) {
    return <Dashboard user={currentUser} />
  }

  return (
    <div className="auth-container">
      {/* Single White Box with Two Containers */}
      <div className="auth-box">
        {/* Container 1: Logo and Tagline */}
        <div className="logo-container">
          <div className="logo">
            <img 
              src="/Looklyy Logo.png" 
              alt="Looklyy" 
              className="logo-image"
              onError={(e) => {
                // Fallback to text logo if image fails to load
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            {/* Fallback text logo */}
            <div className="logo-text" style={{ display: 'none' }}>
              <span className="logo-l">L</span>
              <span className="logo-oo">
                <span className="circle circle-1"></span>
                <span className="circle circle-2"></span>
              </span>
              <span className="logo-klyy">klyy</span>
            </div>
          </div>
          <p className="tagline">LOOK BOARDS FOR SIMPLY FLAWLESS LOOKS</p>
        </div>

        {/* Container 2: Sign In/Sign Up Buttons */}
        <div className="buttons-container">
          <h2 className="welcome-text">Welcome to Looklyy</h2>
          <p className="welcome-subtitle">Choose how you'd like to get started</p>
          
          <div className="auth-buttons">
            <button 
              className="auth-button signin-btn"
              onClick={() => setIsLogin(true)}
            >
              SIGN IN
            </button>
            <button 
              className="auth-button signup-btn"
              onClick={() => setIsLogin(false)}
            >
              SIGN UP
            </button>
          </div>
        </div>
      </div>

      {/* Form Modal - Only show when user clicks Sign In or Sign Up */}
      {isLogin !== null && (
        <div className="form-modal">
          <div className="form-content">
            <button className="close-btn" onClick={() => setIsLogin(null)}>×</button>
            
            {isLogin ? (
              // Sign In Form
              <div className="auth-form">
                <h2>Sign In</h2>
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <input
                      type="email"
                      placeholder="Email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="password"
                      placeholder="Password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required
                    />
                  </div>
                  {error && <div className="error-message">{error}</div>}
                  <button type="submit" className="auth-button" disabled={loading}>
                    {loading ? 'Signing In...' : 'SIGN IN'}
                  </button>
                </form>
              </div>
            ) : (
              // Sign Up Form
              <div className="auth-form">
                <h2>Create Account</h2>
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <input
                      type="text"
                      placeholder="Full Name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="text"
                      placeholder="Username"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="email"
                      placeholder="Email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="password"
                      placeholder="Password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required
                    />
                  </div>
                  {error && <div className="error-message">{error}</div>}
                  <button type="submit" className="auth-button" disabled={loading}>
                    {loading ? 'Creating Account...' : 'SIGN UP'}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

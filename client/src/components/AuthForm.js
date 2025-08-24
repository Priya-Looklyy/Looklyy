'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Dashboard from './Dashboard'
import './AuthForm.css'

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true)
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
      {/* Logo and Tagline Section - Left Side */}
      <div className="logo-section">
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

      {/* Auth Form Section - Right Side */}
      <div className="auth-box">
        <div className="auth-inner">
          {/* Sign In Form */}
          <div className={`auth-form ${isLogin ? 'active' : ''}`}>
            <div className="auth-content">
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
          </div>

          {/* Sign Up Form */}
          <div className={`auth-form ${!isLogin ? 'active' : ''}`}>
            <div className="auth-content">
              <h2>Create Account</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required={!isLogin}
                  />
                </div>
                <div className="form-group">
                  <input
                    type="text"
                    placeholder="Username"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    required={!isLogin}
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
          </div>

          {/* Overlay */}
          <div className="auth-overlay">
            <div className={`overlay-panel ${isLogin ? 'overlay-left' : 'overlay-right'}`}>
              <h1>Hello, Friend!</h1>
              <p>Enter your personal details and start your journey with us</p>
              <button 
                className="ghost auth-button" 
                onClick={() => setIsLogin(false)}
              >
                Sign Up
              </button>
            </div>
            <div className={`overlay-panel ${!isLogin ? 'overlay-left' : 'overlay-right'}`}>
              <h1>Welcome Back!</h1>
              <p>To keep connected with us please login with your personal info</p>
              <button 
                className="ghost auth-button" 
                onClick={() => setIsLogin(true)}
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

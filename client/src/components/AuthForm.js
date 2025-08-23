'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Dashboard from './Dashboard'

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

      <style jsx>{`
        .auth-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        .auth-box {
          background: #fff;
          border-radius: 10px;
          box-shadow: 0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22);
          position: relative;
          overflow: hidden;
          width: 768px;
          max-width: 100%;
          min-height: 480px;
        }

        .auth-inner {
          position: relative;
          width: 100%;
          height: 100%;
        }

        .auth-form {
          position: absolute;
          top: 0;
          height: 100%;
          transition: all 0.6s ease-in-out;
          width: 50%;
          z-index: 2;
        }

        .auth-form.active {
          left: 0;
          z-index: 5;
        }

        .auth-form:not(.active) {
          left: 0;
          z-index: 1;
        }

        .auth-content {
          background: #fff;
          display: flex;
          flex-direction: column;
          padding: 0 50px;
          height: 100%;
          justify-content: center;
          align-items: center;
          text-align: center;
        }

        .auth-content h2 {
          margin: 0;
          margin-bottom: 20px;
          color: #333;
          font-size: 28px;
          font-weight: 600;
        }

        .form-group {
          margin-bottom: 15px;
          width: 100%;
        }

        .form-group input {
          background: #eee;
          border: none;
          padding: 12px 15px;
          margin: 8px 0;
          width: 100%;
          border-radius: 5px;
          font-size: 14px;
          box-sizing: border-box;
        }

        .form-group input:focus {
          outline: none;
          background: #f0f0f0;
        }

        .auth-button {
          border-radius: 20px;
          border: 1px solid #ff4b2b;
          background: #ff4b2b;
          color: #fff;
          font-size: 12px;
          font-weight: bold;
          padding: 12px 45px;
          letter-spacing: 1px;
          text-transform: uppercase;
          transition: transform 80ms ease-in;
          cursor: pointer;
          margin-top: 10px;
        }

        .auth-button:active {
          transform: scale(0.95);
        }

        .auth-button.ghost {
          background: transparent;
          border-color: #fff;
        }

        .auth-overlay {
          position: absolute;
          top: 0;
          left: 50%;
          width: 50%;
          height: 100%;
          overflow: hidden;
          transition: transform 0.6s ease-in-out;
          z-index: 100;
        }

        .auth-overlay.active {
          transform: translateX(-100%);
        }

        .overlay-panel {
          position: absolute;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          padding: 0 40px;
          text-align: center;
          top: 0;
          height: 100%;
          width: 100%;
          transform: translateX(0);
          transition: transform 0.6s ease-in-out;
        }

        .overlay-panel.overlay-left {
          transform: translateX(-20%);
        }

        .overlay-panel.overlay-right {
          right: 0;
          transform: translateX(0);
        }

        .overlay-panel h1 {
          margin: 0;
          color: #fff;
          font-size: 32px;
          font-weight: 700;
        }

        .overlay-panel p {
          font-size: 14px;
          font-weight: 100;
          line-height: 20px;
          letter-spacing: 0.5px;
          margin: 20px 0 30px;
          color: #fff;
        }

        .error-message {
          color: #ff4b2b;
          font-size: 14px;
          margin-top: 10px;
          text-align: center;
        }

        /* Animation for overlay */
        .auth-inner.active .auth-overlay {
          transform: translateX(-100%);
        }

        .auth-inner.active .overlay-panel.overlay-left {
          transform: translateX(0);
        }

        .auth-inner.active .overlay-panel.overlay-right {
          transform: translateX(20%);
        }

        /* Responsive */
        @media (max-width: 768px) {
          .auth-box {
            width: 100%;
            max-width: 400px;
          }
          
          .auth-form {
            width: 100%;
            position: relative;
          }
          
          .auth-overlay {
            display: none;
          }
        }
      `}</style>
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import ProfileSetupModal from './ProfileSetupModal'

export default function Dashboard({ user }) {
  const [showProfileSetup, setShowProfileSetup] = useState(false)
  const [showWelcome, setShowWelcome] = useState(true)
  const [showSuccess, setShowSuccess] = useState(false)
  const [currentUser, setCurrentUser] = useState(user)
  const router = useRouter()

  useEffect(() => {
    // Check if this is a new user (no username or incomplete profile)
    const isNewUser = !user?.username || !user?.phoneNumber || !user?.stylePreferences?.length
    
    if (isNewUser) {
      // Show welcome message for 3 seconds, then show profile setup modal
      const timer = setTimeout(() => {
        setShowWelcome(false)
        setShowProfileSetup(true)
      }, 3000)
      
      return () => clearTimeout(timer)
    }
  }, [user])

  const handleProfileComplete = (updatedUser) => {
    setCurrentUser(updatedUser)
    setShowProfileSetup(false)
    setShowSuccess(true)
    
    // Show success message for 2 seconds, then fade to dashboard
    setTimeout(() => {
      setShowSuccess(false)
    }, 2000)
  }

  const handleProfileSkip = () => {
    setShowProfileSetup(false)
    // User can continue using the app but with limited functionality
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/')
  }

  if (showWelcome) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="w-24 h-24 bg-purple-600 rounded-full flex items-center justify-center mx-auto">
            <span className="text-3xl font-bold text-white">
              {user?.name?.charAt(0).toUpperCase() || 'W'}
            </span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900">Welcome to Lookly!</h1>
          <p className="text-xl text-gray-600">We're setting up your personalized experience...</p>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          </div>
        </div>
      </div>
    )
  }

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="w-24 h-24 bg-green-600 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-gray-900">Profile Complete!</h1>
          <p className="text-xl text-gray-600">Your personalized Lookly experience is ready</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Lookly</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link href="/brands" className="text-gray-600 hover:text-gray-900">Brands</Link>
              <Link href="/products" className="text-gray-600 hover:text-gray-900">Products</Link>
              <Link href="/color-tool" className="text-gray-600 hover:text-gray-900">Color Tool</Link>
              
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-purple-600">
                    {currentUser?.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="text-sm">
                  <p className="text-gray-900 font-medium">{currentUser?.name}</p>
                  <p className="text-gray-500">@{currentUser?.username}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-gray-600 hover:text-gray-900"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Dashboard Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-purple-600">
                {currentUser?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Welcome back, {currentUser?.name}!</h2>
              <p className="text-gray-600">Ready to create amazing lookboards?</p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">My Lookboards</h3>
            <p className="text-3xl font-bold text-purple-600">0</p>
            <p className="text-gray-500 text-sm">Create your first lookboard</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Favorite Colors</h3>
            <div className="flex space-x-2">
              {currentUser?.favoriteColors?.slice(0, 5).map((color, index) => (
                <div
                  key={index}
                  className="w-6 h-6 rounded-full border border-gray-300"
                  style={{ backgroundColor: color.toLowerCase() }}
                  title={color}
                />
              ))}
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Style Preferences</h3>
            <div className="flex flex-wrap gap-1">
              {currentUser?.stylePreferences?.slice(0, 3).map((style, index) => (
                <span key={index} className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                  {style}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link
                href="/lookboard/create"
                className="block w-full text-left p-3 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Create New Lookboard</p>
                    <p className="text-sm text-gray-500">Start building your style collection</p>
                  </div>
                </div>
              </Link>
              
              <Link
                href="/products"
                className="block w-full text-left p-3 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Browse Products</p>
                    <p className="text-sm text-gray-500">Discover new fashion items</p>
                  </div>
                </div>
              </Link>
              
              <Link
                href="/color-tool"
                className="block w-full text-left p-3 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Color Tool</p>
                    <p className="text-sm text-gray-500">Get color suggestions and harmonies</p>
                  </div>
                </div>
              </Link>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-gray-500">No recent activity</p>
              <p className="text-sm text-gray-400">Start creating lookboards to see your activity here</p>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Setup Modal */}
      <ProfileSetupModal
        isOpen={showProfileSetup}
        onClose={handleProfileSkip}
        onComplete={handleProfileComplete}
        user={currentUser}
        showSkipWarning={true}
      />
    </div>
  )
}

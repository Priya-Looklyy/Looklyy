'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function ProfileSetupModal({ isOpen, onClose, onComplete, user, showSkipWarning = false }) {
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  
  const [formData, setFormData] = useState({
    // Basic Account Information
    name: user?.name || '',
    username: user?.username || '',
    email: user?.email || '',
    phoneNumber: user?.phoneNumber || '',
    
    // Personal Profile Details
    profilePicture: user?.profilePicture || '',
    dateOfBirth: user?.dateOfBirth || '',
    gender: user?.gender || '',
    location: user?.location || '',
    bio: user?.bio || '',
    
    // Fashion Preferences
    stylePreferences: user?.stylePreferences || [],
    favoriteBrands: user?.favoriteBrands || [],
    favoriteColors: user?.favoriteColors || [],
    
    // Size Details
    clothingSize: user?.clothingSize || '',
    shoeSize: user?.shoeSize || '',
    fitPreference: user?.fitPreference || '',
    
    // Optional Enhancements
    wardrobeImages: user?.wardrobeImages || [],
    socialMediaLinks: user?.socialMediaLinks || [],
    wishlist: user?.wishlist || [],
    
    // Settings
    notificationPreferences: user?.notificationPreferences || [],
    privacySettings: user?.privacySettings || {
      profileVisibility: 'public',
      wardrobeVisibility: 'friends'
    },
    paymentInfo: user?.paymentInfo || ''
  })

  const styleOptions = [
    'Casual', 'Streetwear', 'Chic', 'Formal', 'Vintage', 'Minimal', 'Luxury', 
    'Bohemian', 'Athletic', 'Classic', 'Trendy', 'Elegant'
  ]

  const genderOptions = [
    'Female', 'Male', 'Non-binary', 'Gender fluid', 'Prefer not to say'
  ]

  const fitOptions = [
    'Slim', 'Regular', 'Oversized', 'Loose', 'Tight', 'Comfortable'
  ]

  const notificationOptions = [
    'Sales and promotions', 'New arrivals', 'Style recommendations', 
    'Brand updates', 'Community features', 'Security alerts'
  ]

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleArrayChange = (field, value, action = 'toggle') => {
    setFormData(prev => ({
      ...prev,
      [field]: action === 'add' 
        ? [...prev[field], value]
        : action === 'remove'
        ? prev[field].filter(item => item !== value)
        : prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }))
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError('')

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://looklyy.onrender.com'}/api/users/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update profile')
      }

      // Update local storage with new user data
      localStorage.setItem('user', JSON.stringify(data.user))
      
      // Call the onComplete callback with updated user data
      if (onComplete) {
        onComplete(data.user)
      } else {
        // Fallback: close modal and redirect to profile
        onClose()
        router.push('/profile')
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const nextStep = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Basic Account Information</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username/Handle *
              </label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => handleInputChange('username', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number (Optional)
              </label>
              <input
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Personal Profile Details</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Profile Picture URL (Optional)
              </label>
              <input
                type="url"
                value={formData.profilePicture}
                onChange={(e) => handleInputChange('profilePicture', e.target.value)}
                placeholder="https://example.com/photo.jpg"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date of Birth (Optional)
              </label>
              <input
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gender/Identity (Optional)
              </label>
              <select
                value={formData.gender}
                onChange={(e) => handleInputChange('gender', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Select gender</option>
                {genderOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location (Optional)
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder="City, Country"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bio/About Me (Optional)
              </label>
              <textarea
                value={formData.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                rows={3}
                placeholder="Tell us about yourself..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Fashion Preferences</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Style Preferences
              </label>
              <div className="grid grid-cols-3 gap-2">
                {styleOptions.map((style) => (
                  <button
                    key={style}
                    type="button"
                    onClick={() => handleArrayChange('stylePreferences', style)}
                    className={`p-2 rounded-md text-xs font-medium transition-colors ${
                      formData.stylePreferences.includes(style)
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Favorite Colors
              </label>
              <div className="grid grid-cols-5 gap-2">
                {['Red', 'Blue', 'Green', 'Yellow', 'Purple', 'Orange', 'Pink', 'Brown', 'Black', 'White', 'Gray', 'Teal', 'Indigo', 'Violet', 'Cyan'].map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => handleArrayChange('favoriteColors', color)}
                    className={`p-2 rounded-md text-xs font-medium transition-colors ${
                      formData.favoriteColors.includes(color)
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Favorite Brands (Optional)
              </label>
              <input
                type="text"
                placeholder="Enter brands separated by commas"
                value={formData.favoriteBrands.join(', ')}
                onChange={(e) => handleInputChange('favoriteBrands', e.target.value.split(',').map(b => b.trim()).filter(b => b))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Size Details</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Clothing Size (Optional)
              </label>
              <select
                value={formData.clothingSize}
                onChange={(e) => handleInputChange('clothingSize', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Select size</option>
                {['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'].map(size => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Shoe Size (Optional)
              </label>
              <select
                value={formData.shoeSize}
                onChange={(e) => handleInputChange('shoeSize', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Select shoe size</option>
                {Array.from({length: 15}, (_, i) => i + 1).map(size => (
                  <option key={size} value={size.toString()}>{size}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fit Preference (Optional)
              </label>
              <select
                value={formData.fitPreference}
                onChange={(e) => handleInputChange('fitPreference', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Select fit preference</option>
                {fitOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
          </div>
        )

      case 5:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Settings & Preferences</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notification Preferences
              </label>
              <div className="space-y-2">
                {notificationOptions.map((option) => (
                  <label key={option} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.notificationPreferences.includes(option)}
                      onChange={() => handleArrayChange('notificationPreferences', option)}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">{option}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Profile Visibility
              </label>
              <select
                value={formData.privacySettings.profileVisibility}
                onChange={(e) => handleInputChange('privacySettings', {
                  ...formData.privacySettings,
                  profileVisibility: e.target.value
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="public">Public</option>
                <option value="friends">Friends only</option>
                <option value="private">Private</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Wardrobe Visibility
              </label>
              <select
                value={formData.privacySettings.wardrobeVisibility}
                onChange={(e) => handleInputChange('privacySettings', {
                  ...formData.privacySettings,
                  wardrobeVisibility: e.target.value
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="public">Public</option>
                <option value="friends">Friends only</option>
                <option value="private">Private</option>
              </select>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Complete Your Profile</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Step {currentStep} of 5</span>
            <span>{Math.round((currentStep / 5) * 100)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 5) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Step Content */}
        {renderStep()}

        {/* Error Message */}
        {error && (
          <div className="mt-4 text-red-600 text-sm text-center bg-red-50 p-3 rounded-md">
            {error}
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          {currentStep < 5 ? (
            <button
              onClick={nextStep}
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : 'Complete Profile'}
            </button>
          )}
        </div>

        {/* Skip Option */}
        <div className="text-center mt-4">
          {showSkipWarning ? (
            <div className="space-y-2">
              <button
                onClick={onClose}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Skip for now
              </button>
              <p className="text-xs text-amber-600 bg-amber-50 p-2 rounded">
                ⚠️ Note: Skipping will limit Lookly's functionality. You can complete your profile later in settings.
              </p>
            </div>
          ) : (
            <button
              onClick={onClose}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Skip for now
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

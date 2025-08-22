'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function ProfilePage() {
  const [user, setUser] = useState(null)
  const [lookboards, setLookboards] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newLookboard, setNewLookboard] = useState({ title: '', images: '' })
  const [creating, setCreating] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }
    fetchUserData()
    fetchLookboards()
  }, [router])

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:4000/api/users/me', {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
      }
    } catch (error) {
      console.error('Error fetching user:', error)
    }
  }

  const fetchLookboards = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:4000/api/lookboards', {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (response.ok) {
        const data = await response.json()
        setLookboards(data.lookboards)
      }
    } catch (error) {
      console.error('Error fetching lookboards:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateLookboard = async (e) => {
    e.preventDefault()
    setCreating(true)

    try {
      const token = localStorage.getItem('token')
      const images = newLookboard.images.split(',').map(url => url.trim()).filter(url => url)
      
      const response = await fetch('http://localhost:4000/api/lookboards', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          title: newLookboard.title,
          images
        })
      })

      if (response.ok) {
        setNewLookboard({ title: '', images: '' })
        setShowCreateForm(false)
        fetchLookboards()
      }
    } catch (error) {
      console.error('Error creating lookboard:', error)
    } finally {
      setCreating(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">Lookly</h1>
            <nav className="flex space-x-6">
              <Link href="/brands" className="text-gray-600 hover:text-gray-900">Brands</Link>
              <Link href="/products" className="text-gray-600 hover:text-gray-900">Products</Link>
              <Link href="/color-tool" className="text-gray-600 hover:text-gray-900">Color Tool</Link>
              <button
                onClick={handleLogout}
                className="text-gray-600 hover:text-gray-900"
              >
                Logout
              </button>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* User Profile Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-purple-600">
                {user.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
              <p className="text-gray-600">{user.email}</p>
              {user.bio && <p className="text-gray-700 mt-2">{user.bio}</p>}
              {user.favoriteColors.length > 0 && (
                <div className="mt-3">
                  <span className="text-sm text-gray-500">Favorite colors: </span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {user.favoriteColors.map((color) => (
                      <span
                        key={color}
                        className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full"
                      >
                        {color}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Lookboards Section */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">My Lookboards</h3>
              <button
                onClick={() => setShowCreateForm(!showCreateForm)}
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {showCreateForm ? 'Cancel' : 'Create New'}
              </button>
            </div>
          </div>

          {/* Create Lookboard Form */}
          {showCreateForm && (
            <div className="px-6 py-4 border-b border-gray-200">
              <form onSubmit={handleCreateLookboard} className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    Title *
                  </label>
                  <input
                    id="title"
                    type="text"
                    required
                    value={newLookboard.title}
                    onChange={(e) => setNewLookboard({ ...newLookboard, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter lookboard title"
                  />
                </div>
                <div>
                  <label htmlFor="images" className="block text-sm font-medium text-gray-700 mb-1">
                    Image URLs (comma-separated)
                  </label>
                  <textarea
                    id="images"
                    rows={3}
                    value={newLookboard.images}
                    onChange={(e) => setNewLookboard({ ...newLookboard, images: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                  />
                </div>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
                >
                  {creating ? 'Creating...' : 'Create Lookboard'}
                </button>
              </form>
            </div>
          )}

          {/* Lookboards List */}
          <div className="p-6">
            {lookboards.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No lookboards yet. Create your first one!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {lookboards.map((lookboard) => (
                  <Link
                    key={lookboard.id}
                    href={`/lookboard/${lookboard.id}`}
                    className="block bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors"
                  >
                    <h4 className="font-medium text-gray-900 mb-2">{lookboard.title}</h4>
                    <p className="text-sm text-gray-600">
                      {lookboard.images.length} image{lookboard.images.length !== 1 ? 's' : ''}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      Created {new Date(lookboard.createdAt).toLocaleDateString()}
                    </p>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

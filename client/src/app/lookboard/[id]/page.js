'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import LookSuggestions from '../../../components/LookSuggestions.js'

export default function LookboardDetailPage() {
  const [lookboard, setLookboard] = useState(null)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [editForm, setEditForm] = useState({ title: '', images: '' })
  const [saving, setSaving] = useState(false)
  const router = useRouter()
  const params = useParams()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }
    fetchLookboard()
    fetchProducts()
  }, [params.id, router])

  const fetchLookboard = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:4000/api/lookboards/${params.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (response.ok) {
        const data = await response.json()
        setLookboard(data.lookboard)
        setEditForm({
          title: data.lookboard.title,
          images: data.lookboard.images.join(', ')
        })
      } else if (response.status === 404) {
        router.push('/profile')
      }
    } catch (error) {
      console.error('Error fetching lookboard:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:4000/api/products', {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (response.ok) {
        const data = await response.json()
        setProducts(data.products)
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    }
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)

    try {
      const token = localStorage.getItem('token')
      const images = editForm.images.split(',').map(url => url.trim()).filter(url => url)
      
      const response = await fetch(`http://localhost:4000/api/lookboards/${params.id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          title: editForm.title,
          images
        })
      })

      if (response.ok) {
        setEditing(false)
        fetchLookboard()
      }
    } catch (error) {
      console.error('Error updating lookboard:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this lookboard?')) return

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:4000/api/lookboards/${params.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })

      if (response.ok) {
        router.push('/profile')
      }
    } catch (error) {
      console.error('Error deleting lookboard:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  if (!lookboard) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/profile" className="text-2xl font-bold text-gray-900 hover:text-purple-600">
              Lookly
            </Link>
            <nav className="flex space-x-6">
              <Link href="/brands" className="text-gray-600 hover:text-gray-900">Brands</Link>
              <Link href="/products" className="text-gray-600 hover:text-gray-900">Products</Link>
              <Link href="/profile" className="text-gray-600 hover:text-gray-900">Profile</Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Lookboard Header */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex justify-between items-start">
            <div>
              {editing ? (
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  className="text-3xl font-bold text-gray-900 bg-gray-50 border border-gray-300 rounded px-3 py-2 w-full max-w-md"
                />
              ) : (
                <h1 className="text-3xl font-bold text-gray-900">{lookboard.title}</h1>
              )}
              <p className="text-gray-600 mt-2">
                Created {new Date(lookboard.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="flex space-x-3">
              {editing ? (
                <>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
                  >
                    {saving ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    onClick={() => {
                      setEditing(false)
                      setEditForm({
                        title: lookboard.title,
                        images: lookboard.images.join(', ')
                      })
                    }}
                    className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setEditing(true)}
                    className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    Edit
                  </button>
                  <button
                    onClick={handleDelete}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Edit Images Form */}
          {editing && (
            <div className="mt-6">
              <label htmlFor="images" className="block text-sm font-medium text-gray-700 mb-2">
                Image URLs (comma-separated)
              </label>
              <textarea
                id="images"
                rows={3}
                value={editForm.images}
                onChange={(e) => setEditForm({ ...editForm, images: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
              />
            </div>
          )}
        </div>

        {/* Images Grid */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Images</h2>
          {lookboard.images.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No images in this lookboard yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {lookboard.images.map((imageUrl, index) => (
                <div key={index} className="group relative">
                  <img
                    src={imageUrl}
                    alt={`Image ${index + 1}`}
                    className="w-full h-64 object-cover rounded-lg shadow-md group-hover:shadow-lg transition-shadow"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Found'
                    }}
                  />
                  <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                    {index + 1}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Look Suggestions */}
        <LookSuggestions 
          lookboardImages={lookboard.images}
          products={products}
        />
      </div>
    </div>
  )
}

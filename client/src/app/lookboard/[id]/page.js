import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import LookSuggestions from '../../../components/LookSuggestions.js'

// Add this function for static export compatibility
export async function generateStaticParams() {
  // Return an empty array since we don't know the IDs at build time
  // This allows the page to be built for static export
  return []
}

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
          {editing &

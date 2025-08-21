'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'

export default function LookboardDetailPage() {
  const [lookboard, setLookboard] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const params = useParams()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }
    fetchLookboard()
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
      } else if (response.status === 404) {
        router.push('/profile')
      }
    } catch (error) {
      console.error('Error fetching lookboard:', error)
    } finally {
      setLoading(false)
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
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{lookboard.title}</h1>
          <p className="text-gray-600 mt-2">
            Created {new Date(lookboard.createdAt).toLocaleDateString()}
          </p>
        </div>

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

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Look Suggestions</h2>
          <p className="text-gray-500 text-center py-8">
            Look suggestions feature will be available here.
          </p>
        </div>
      </div>
    </div>
  )
}

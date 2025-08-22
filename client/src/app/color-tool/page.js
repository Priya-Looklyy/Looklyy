'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import ColorSuggestionTool from '../../components/ColorSuggestionTool.js'

export default function ColorToolPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }
    fetchProducts()
  }, [router])

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
              <Link href="/profile" className="text-gray-600 hover:text-gray-900">Profile</Link>
              <Link href="/brands" className="text-gray-600 hover:text-gray-900">Brands</Link>
              <Link href="/products" className="text-gray-600 hover:text-gray-900">Products</Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Color Tool */}
      <ColorSuggestionTool products={products} />
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function BrandsPage() {
  const [brands, setBrands] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }
    fetchBrands()
  }, [router])

  const fetchBrands = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:4000/api/brands', {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (response.ok) {
        const data = await response.json()
        setBrands(data.brands)
      }
    } catch (error) {
      console.error('Error fetching brands:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredBrands = brands.filter(brand =>
    brand.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (brand.description && brand.description.toLowerCase().includes(searchTerm.toLowerCase()))
  )

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
              <Link href="/products" className="text-gray-600 hover:text-gray-900">Products</Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Brands</h1>
          <p className="text-gray-600">Discover and explore different brands</p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="max-w-md">
            <label htmlFor="search" className="sr-only">
              Search brands
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                id="search"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                placeholder="Search brands..."
              />
            </div>
          </div>
        </div>

        {/* Brands Grid */}
        <div className="bg-white rounded-lg shadow">
          {filteredBrands.length === 0 ? (
            <div className="text-center py-12">
              {searchTerm ? (
                <p className="text-gray-500">No brands found matching "{searchTerm}"</p>
              ) : (
                <p className="text-gray-500">No brands available yet.</p>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
              {filteredBrands.map((brand) => (
                <div key={brand.id} className="bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-colors">
                  <div className="flex items-center space-x-4 mb-4">
                    {brand.logoUrl ? (
                      <img
                        src={brand.logoUrl}
                        alt={`${brand.name} logo`}
                        className="w-16 h-16 object-contain rounded-lg bg-white p-2 shadow-sm"
                        onError={(e) => {
                          e.target.style.display = 'none'
                        }}
                      />
                    ) : (
                      <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center">
                        <span className="text-2xl font-bold text-purple-600">
                          {brand.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">{brand.name}</h3>
                      {brand.description && (
                        <p className="text-sm text-gray-600 line-clamp-2">{brand.description}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <Link
                      href={`/brands/${brand.id}`}
                      className="text-purple-600 hover:text-purple-700 text-sm font-medium"
                    >
                      View Details →
                    </Link>
                    <Link
                      href={`/products?brandId=${brand.id}`}
                      className="text-gray-600 hover:text-gray-700 text-sm"
                    >
                      View Products
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Results Count */}
        {searchTerm && (
          <div className="mt-4 text-sm text-gray-600">
            Found {filteredBrands.length} brand{filteredBrands.length !== 1 ? 's' : ''} matching "{searchTerm}"
          </div>
        )}
      </div>
    </div>
  )
}

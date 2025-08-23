'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

function ProductsContent() {
  const [products, setProducts] = useState([])
  const [brands, setBrands] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedColor, setSelectedColor] = useState('')
  const [selectedBrand, setSelectedBrand] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()

  const colorOptions = [
    'Red', 'Blue', 'Green', 'Yellow', 'Purple', 'Orange', 'Pink', 'Brown', 'Black', 'White',
    'Gray', 'Teal', 'Indigo', 'Violet', 'Cyan', 'Magenta', 'Lime', 'Amber', 'Rose', 'Slate'
  ]

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }

    // Check for URL params
    const colorParam = searchParams.get('color')
    const brandParam = searchParams.get('brandId')
    
    if (colorParam) setSelectedColor(colorParam)
    if (brandParam) setSelectedBrand(brandParam)

    fetchBrands()
    fetchProducts()
  }, [router, searchParams])

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
    }
  }

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('token')
      let url = 'http://localhost:4000/api/products?'
      const params = new URLSearchParams()
      
      if (selectedColor) params.append('color', selectedColor)
      if (selectedBrand) params.append('brandId', selectedBrand)
      
      if (params.toString()) {
        url += params.toString()
      }

      const response = await fetch(url, {
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

  const handleColorChange = (color) => {
    setSelectedColor(color === selectedColor ? '' : color)
  }

  const handleBrandChange = (brandId) => {
    setSelectedBrand(brandId === selectedBrand ? '' : brandId)
  }

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (product.brand && product.brand.name.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  useEffect(() => {
    fetchProducts()
  }, [selectedColor, selectedBrand])

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
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Products</h1>
          <p className="text-gray-600">Discover products from your favorite brands</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Search */}
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                Search Products
              </label>
              <input
                id="search"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Search by name, description, or brand..."
              />
            </div>

            {/* Color Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Color
              </label>
              <div className="grid grid-cols-5 gap-2 max-h-32 overflow-y-auto">
                {colorOptions.map((color) => (
                  <button
                    key={color}
                    onClick={() => handleColorChange(color)}
                    className={`p-2 rounded-md text-xs font-medium transition-colors ${
                      selectedColor === color
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Brand Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Brand
              </label>
              <select
                value={selectedBrand}
                onChange={(e) => handleBrandChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">All Brands</option>
                {brands.map((brand) => (
                  <option key={brand.id} value={brand.id}>
                    {brand.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Active Filters */}
          {(selectedColor || selectedBrand) && (
            <div className="mt-4 flex flex-wrap gap-2">
              {selectedColor && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                  Color: {selectedColor}
                  <button
                    onClick={() => setSelectedColor('')}
                    className="ml-2 inline-flex items-center justify-center w-4 h-4 rounded-full text-purple-400 hover:bg-purple-200 hover:text-purple-500"
                  >
                    ×
                  </button>
                </span>
              )}
              {selectedBrand && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  Brand: {brands.find(b => b.id === selectedBrand)?.name}
                  <button
                    onClick={() => setSelectedBrand('')}
                    className="ml-2 inline-flex items-center justify-center w-4 h-4 rounded-full text-blue-400 hover:bg-blue-200 hover:text-blue-500"
                  >
                    ×
                  </button>
                </span>
              )}
            </div>
          )}
        </div>

        {/* Products Grid */}
        <div className="bg-white rounded-lg shadow">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No products found matching your criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
              {filteredProducts.map((product) => (
                <div key={product.id} className="bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-colors">
                  {product.imageUrl && (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                      onError={(e) => {
                        e.target.style.display = 'none'
                      }}
                    />
                  )}
                  
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.name}</h3>
                    {product.description && (
                      <p className="text-sm text-gray-600 mb-2">{product.description}</p>
                    )}
                    {product.brand && (
                      <p className="text-sm text-purple-600 font-medium">{product.brand.name}</p>
                    )}
                    {product.price && (
                      <p className="text-lg font-bold text-gray-900">${product.price}</p>
                    )}
                  </div>

                  {/* Color Tags */}
                  {product.colors.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs text-gray-500 mb-2">Available Colors:</p>
                      <div className="flex flex-wrap gap-1">
                        {product.colors.map((color) => (
                          <span
                            key={color}
                            className="px-2 py-1 text-xs font-medium bg-gray-200 text-gray-800 rounded-full"
                          >
                            {color}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <Link
                    href={`/products/${product.id}`}
                    className="text-purple-600 hover:text-purple-700 text-sm font-medium"
                  >
                    View Details →
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mt-4 text-sm text-gray-600">
          Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
          {selectedColor && ` in ${selectedColor}`}
          {selectedBrand && ` from ${brands.find(b => b.id === selectedBrand)?.name}`}
        </div>
      </div>
    </div>
  )
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="text-lg">Loading...</div></div>}>
      <ProductsContent />
    </Suspense>
  )
}

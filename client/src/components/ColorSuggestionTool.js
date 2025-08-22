'use client'

import React, { useState, useEffect } from 'react'
import { ColorUtility } from '../utils/colorUtils'

export default function ColorSuggestionTool({ products = [] }) {
  const [selectedColor, setSelectedColor] = useState('#FF6B6B')
  const [harmonies, setHarmonies] = useState(null)
  const [matchingProducts, setMatchingProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [showProductMatches, setShowProductMatches] = useState(false)

  useEffect(() => {
    if (selectedColor) {
      generateColorSuggestions()
    }
  }, [selectedColor])

  const generateColorSuggestions = () => {
    try {
      const colorHarmonies = ColorUtility.generateHarmonies(selectedColor)
      setHarmonies(colorHarmonies)
    } catch (error) {
      console.error('Error generating color harmonies:', error)
    }
  }

  const findMatchingProducts = async () => {
    if (products.length === 0) return

    setLoading(true)
    try {
      const matches = await ColorUtility.findMatchingProducts(
        selectedColor,
        products,
        8,
        80
      )
      setMatchingProducts(matches)
      setShowProductMatches(true)
    } catch (error) {
      console.error('Error finding matching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const ColorSwatch = ({ color, label, onClick }) => (
    <div 
      className="flex flex-col items-center cursor-pointer hover:scale-105 transition-transform"
      onClick={onClick}
    >
      <div 
        className="w-16 h-16 rounded-lg shadow-md border-2 border-gray-200 hover:border-gray-400"
        style={{ backgroundColor: color }}
        title={color}
      />
      {label && (
        <span className="text-xs text-gray-600 mt-1 text-center max-w-16 truncate">
          {label}
        </span>
      )}
    </div>
  )

  const ColorHarmonySection = ({ title, colors, description }) => (
    <div className="bg-white rounded-lg p-4 shadow-sm">
      <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-600 mb-3">{description}</p>
      <div className="flex gap-3 flex-wrap">
        {colors.map((color, index) => (
          <ColorSwatch 
            key={index} 
            color={color} 
            label={ColorUtility.getColorName(color)}
            onClick={() => setSelectedColor(color)}
          />
        ))}
      </div>
    </div>
  )

  const ProductCard = ({ match }) => (
    <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
      {match.product.imageUrl && (
        <img
          src={match.product.imageUrl}
          alt={match.product.name}
          className="w-full h-24 object-cover rounded-lg mb-3"
          onError={(e) => {
            e.currentTarget.style.display = 'none'
          }}
        />
      )}
      
      <h4 className="font-medium text-gray-900 text-sm mb-1 truncate">{match.product.name}</h4>
      {match.product.brand && (
        <p className="text-xs text-purple-600 mb-2">{match.product.brand.name}</p>
      )}
      
      <div className="flex items-center justify-between mb-2">
        <div 
          className="w-4 h-4 rounded-full border border-gray-300"
          style={{ backgroundColor: match.matchedColor }}
          title={match.matchedColor}
        />
        <span className="text-xs font-medium text-gray-700">
          {Math.round(match.similarity)}% match
        </span>
      </div>
      
      <div className="flex flex-wrap gap-1">
        {match.product.colors.slice(0, 3).map((color, index) => (
          <div
            key={index}
            className="w-3 h-3 rounded-full border border-gray-300"
            style={{ backgroundColor: color }}
            title={color}
          />
        ))}
        {match.product.colors.length > 3 && (
          <span className="text-xs text-gray-500">+{match.product.colors.length - 3}</span>
        )}
      </div>
    </div>
  )

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Color Suggestion Tool</h2>
        <p className="text-gray-600">Discover color harmonies and find matching products</p>
      </div>

      {/* Color Picker */}
      <div className="bg-white rounded-lg p-6 shadow-lg">
        <div className="flex items-center justify-center space-x-6 mb-6">
          <div>
            <label htmlFor="colorPicker" className="block text-sm font-medium text-gray-700 mb-2">
              Select a Color
            </label>
            <input
              type="color"
              id="colorPicker"
              value={selectedColor}
              onChange={(e) => setSelectedColor(e.target.value)}
              className="w-16 h-16 rounded-lg border-2 border-gray-300 cursor-pointer"
            />
          </div>
          <div>
            <div 
              className="w-16 h-16 rounded-lg shadow-md border-2 border-gray-200"
              style={{ backgroundColor: selectedColor }}
            />
            <p className="text-sm text-gray-600 mt-1 text-center">{selectedColor}</p>
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={findMatchingProducts}
            disabled={loading || products.length === 0}
            className="px-6 py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Finding Matches...' : 'Find Matching Products'}
          </button>
          {products.length === 0 && (
            <p className="text-sm text-gray-500 mt-2">No products available for matching</p>
          )}
        </div>
      </div>

      {/* Color Harmonies */}
      {harmonies && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ColorHarmonySection
            title="Complementary"
            colors={[harmonies.complementary]}
            description="Opposite colors on the color wheel for high contrast"
          />
          
          <ColorHarmonySection
            title="Analogous"
            colors={harmonies.analogous}
            description="Colors next to each other for harmonious looks"
          />
          
          <ColorHarmonySection
            title="Triadic"
            colors={harmonies.triadic}
            description="Three colors equally spaced for balanced combinations"
          />
          
          <ColorHarmonySection
            title="Split Complementary"
            colors={harmonies.splitComplementary}
            description="One base color with two colors adjacent to its complement"
          />
          
          <ColorHarmonySection
            title="Tetradic"
            colors={harmonies.tetradic}
            description="Four colors forming a rectangle for rich palettes"
          />
        </div>
      )}

      {/* Matching Products */}
      {showProductMatches && (
        <div className="bg-white rounded-lg p-6 shadow-lg">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Matching Products</h3>
          
          {matchingProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {matchingProducts.map((match) => (
                <ProductCard key={match.product.id} match={match} />
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No matching products found</p>
          )}
        </div>
      )}

      {/* Color Palette Generator */}
      {selectedColor && (
        <div className="bg-white rounded-lg p-6 shadow-lg">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Color Palette</h3>
          <div className="flex gap-3 flex-wrap">
            {ColorUtility.generatePalette(selectedColor, 5).map((color, index) => (
              <ColorSwatch 
                key={index} 
                color={color} 
                label={`${index === 0 ? 'Base' : index <= 2 ? 'Light' : 'Dark'} ${index + 1}`}
                onClick={() => setSelectedColor(color)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

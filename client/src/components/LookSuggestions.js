'use client'

import React, { useState, useEffect } from 'react'
import { ColorUtility } from '../utils/colorUtils'
import { ImageColorExtractor } from '../utils/imageColorExtractor'

export default function LookSuggestions({ lookboardImages, products }) {
  const [extractedColors, setExtractedColors] = useState(null)
  const [suggestions, setSuggestions] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const generateSuggestions = async () => {
    if (lookboardImages.length === 0) {
      setError('No images available for color extraction')
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Extract colors from all images
      const colorPalette = await ImageColorExtractor.extractColorsFromMultipleImages(
        lookboardImages,
        3
      )
      setExtractedColors(colorPalette)

      // Generate color harmonies for the dominant colors
      const dominantColor = colorPalette.dominantColors[0]?.color || colorPalette.averageColor
      const harmonies = ColorUtility.generateHarmonies(dominantColor)

      // Find matching products for each harmony type
      const [complementary, analogous, triadic] = await Promise.all([
        ColorUtility.findMatchingProducts(harmonies.complementary, products, 4, 80),
        ColorUtility.findMatchingProducts(harmonies.analogous[0], products, 4, 80),
        ColorUtility.findMatchingProducts(harmonies.triadic[0], products, 4, 80)
      ])

      setSuggestions({
        complementary,
        analogous,
        triadic
      })
    } catch (err) {
      console.error('Error generating suggestions:', err)
      setError('Failed to generate look suggestions. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const ColorSwatch = ({ color, label, percentage }) => (
    <div className="flex flex-col items-center">
      <div 
        className="w-12 h-12 rounded-lg shadow-md border-2 border-gray-200"
        style={{ backgroundColor: color }}
        title={color}
      />
      {label && (
        <span className="text-xs text-gray-600 mt-1 text-center max-w-16 truncate">
          {label}
        </span>
      )}
      {percentage && (
        <span className="text-xs text-gray-500">
          {percentage.toFixed(1)}%
        </span>
      )}
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

  const SuggestionSection = ({ title, description, products, baseColor }) => (
    <div className="bg-white rounded-lg p-6 shadow-lg">
      <div className="flex items-center space-x-3 mb-4">
        <div 
          className="w-6 h-6 rounded-full border border-gray-300"
          style={{ backgroundColor: baseColor }}
        />
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>
      
      {products.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {products.map((match) => (
            <ProductCard key={match.product.id} match={match} />
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center py-4">No matching products found</p>
      )}
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Generate Suggestions Button */}
      <div className="bg-white rounded-lg p-6 shadow-lg">
        <div className="text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Get Look Suggestions</h3>
          <p className="text-gray-600 mb-4">
            Analyze your lookboard images and discover matching products based on color theory
          </p>
          
          <button
            onClick={generateSuggestions}
            disabled={loading || lookboardImages.length === 0}
            className="px-6 py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Analyzing Images...' : 'Suggest Looks'}
          </button>
          
          {lookboardImages.length === 0 && (
            <p className="text-sm text-gray-500 mt-2">Add images to your lookboard first</p>
          )}
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {/* Extracted Colors */}
      {extractedColors && (
        <div className="bg-white rounded-lg p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Extracted Color Palette</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Dominant Colors */}
            <div>
              <h4 className="font-medium text-gray-700 mb-3">Dominant Colors</h4>
              <div className="flex gap-3 flex-wrap">
                {extractedColors.dominantColors.map((color, index) => (
                  <ColorSwatch
                    key={index}
                    color={color.color}
                    label={`Color ${index + 1}`}
                    percentage={color.percentage}
                  />
                ))}
              </div>
            </div>

            {/* Color Analysis */}
            <div>
              <h4 className="font-medium text-gray-700 mb-3">Color Analysis</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <ColorSwatch color={extractedColors.averageColor} label="Average" />
                  <span className="text-sm text-gray-600">Overall average color</span>
                </div>
                <div className="flex items-center space-x-3">
                  <ColorSwatch color={extractedColors.vibrantColor} label="Vibrant" />
                  <span className="text-sm text-gray-600">Most saturated color</span>
                </div>
                <div className="flex items-center space-x-3">
                  <ColorSwatch color={extractedColors.mutedColor} label="Muted" />
                  <span className="text-sm text-gray-600">Most neutral color</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Suggestions */}
      {suggestions && extractedColors && (
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-gray-900">Look Suggestions</h3>
          
          <SuggestionSection
            title="Complementary Style"
            description="Products that complement your dominant colors for high contrast looks"
            products={suggestions.complementary}
            baseColor={ColorUtility.generateHarmonies(extractedColors.dominantColors[0]?.color || extractedColors.averageColor).complementary}
          />
          
          <SuggestionSection
            title="Analogous Style"
            description="Products with similar colors for harmonious, cohesive looks"
            products={suggestions.analogous}
            baseColor={ColorUtility.generateHarmonies(extractedColors.dominantColors[0]?.color || extractedColors.averageColor).analogous[0]}
          />
          
          <SuggestionSection
            title="Triadic Style"
            description="Products with balanced, vibrant color combinations"
            products={suggestions.triadic}
            baseColor={ColorUtility.generateHarmonies(extractedColors.dominantColors[0]?.color || extractedColors.averageColor).triadic[0]}
          />
        </div>
      )}
    </div>
  )
}

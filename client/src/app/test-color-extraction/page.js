'use client'

import { useState } from 'react'
import { ImageColorExtractor } from '../../utils/imageColorExtractor'

export default function TestColorExtractionPage() {
  const [testImageUrl, setTestImageUrl] = useState('https://picsum.photos/400/300')
  const [extractedColors, setExtractedColors] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const testColorExtraction = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const colors = await ImageColorExtractor.extractColors(testImageUrl, 5)
      setExtractedColors(colors)
    } catch (err) {
      console.error('Error:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const ColorSwatch = ({ color, label, percentage }) => (
    <div className="flex flex-col items-center">
      <div 
        className="w-16 h-16 rounded-lg shadow-md border-2 border-gray-200"
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

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Color Extraction Test</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Test Image</h2>
          
          <div className="flex items-center space-x-4 mb-4">
            <input
              type="text"
              value={testImageUrl}
              onChange={(e) => setTestImageUrl(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Enter image URL"
            />
            <button
              onClick={testColorExtraction}
              disabled={loading}
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50"
            >
              {loading ? 'Extracting...' : 'Extract Colors'}
            </button>
          </div>
          
          <div className="flex justify-center">
            <img
              src={testImageUrl}
              alt="Test"
              className="max-w-md rounded-lg shadow-md"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Found'
              }}
            />
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600">Error: {error}</p>
          </div>
        )}

        {extractedColors && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Extracted Colors</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Dominant Colors */}
              <div>
                <h3 className="font-medium text-gray-700 mb-3">Dominant Colors</h3>
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
                <h3 className="font-medium text-gray-700 mb-3">Color Analysis</h3>
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

            {/* Color Values */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-700 mb-2">Color Values</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Average:</strong> {extractedColors.averageColor}
                </div>
                <div>
                  <strong>Vibrant:</strong> {extractedColors.vibrantColor}
                </div>
                <div>
                  <strong>Muted:</strong> {extractedColors.mutedColor}
                </div>
                <div>
                  <strong>Dominant:</strong> {extractedColors.dominantColors[0]?.color || 'N/A'}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

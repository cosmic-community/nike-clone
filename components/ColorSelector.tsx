'use client'

import { useState } from 'react'

interface ColorSelectorProps {
  colors: string[]
}

const colorMap: Record<string, string> = {
  Black: '#000000',
  White: '#FFFFFF',
  Red: '#FF0000',
  Blue: '#0000FF',
  Grey: '#808080',
  Green: '#008000',
  Orange: '#FFA500',
  Pink: '#FFC0CB',
}

export default function ColorSelector({ colors }: ColorSelectorProps) {
  const [selectedColor, setSelectedColor] = useState<string | null>(null)

  return (
    <div className="mb-6">
      <h3 className="font-medium mb-3">
        {selectedColor ? `Color: ${selectedColor}` : 'Select Color'}
      </h3>
      <div className="flex gap-2">
        {colors.map((color) => (
          <button
            key={color}
            onClick={() => setSelectedColor(color)}
            className={`w-10 h-10 rounded-full border-2 transition-all ${
              selectedColor === color
                ? 'border-nike-black scale-110'
                : 'border-gray-300 hover:border-nike-black'
            }`}
            style={{ backgroundColor: colorMap[color] || '#CCCCCC' }}
            aria-label={`Select ${color}`}
          >
            {color === 'White' && (
              <span className="block w-full h-full rounded-full border border-gray-200" />
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
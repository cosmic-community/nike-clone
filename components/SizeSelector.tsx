'use client'

import { useState } from 'react'

interface SizeSelectorProps {
  sizes: string[]
}

export default function SizeSelector({ sizes }: SizeSelectorProps) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null)

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium">Select Size</h3>
        <button className="text-nike-gray text-sm hover:text-nike-black transition-colors">
          Size Guide
        </button>
      </div>
      <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
        {sizes.map((size) => (
          <button
            key={size}
            onClick={() => setSelectedSize(size)}
            className={`py-3 border text-sm font-medium transition-colors ${
              selectedSize === size
                ? 'border-nike-black bg-nike-black text-white'
                : 'border-gray-300 hover:border-nike-black'
            }`}
          >
            {size}
          </button>
        ))}
      </div>
    </div>
  )
}
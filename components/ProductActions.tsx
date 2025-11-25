'use client'

import { useState } from 'react'
import SizeSelector from '@/components/SizeSelector'
import ColorSelector from '@/components/ColorSelector'
import AddToCartButton from '@/components/AddToCartButton'
import { Product } from '@/types'

interface ProductActionsProps {
  product: Product
}

export default function ProductActions({ product }: ProductActionsProps) {
  const { metadata } = product
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColor, setSelectedColor] = useState(
    metadata.colors && metadata.colors.length > 0 ? metadata.colors[0] : ''
  )

  return (
    <div>
      {metadata.colors && metadata.colors.length > 0 && (
        <ColorSelector 
          colors={metadata.colors} 
          selectedColor={selectedColor}
          onColorSelect={setSelectedColor}
        />
      )}

      {metadata.available_sizes && metadata.available_sizes.length > 0 && (
        <SizeSelector 
          sizes={metadata.available_sizes}
          selectedSize={selectedSize}
          onSizeSelect={setSelectedSize}
        />
      )}

      <AddToCartButton 
        product={product}
        selectedSize={selectedSize}
        selectedColor={selectedColor || ''} // Changed: Use || instead of ?? for consistency
      />
      
      <button className="w-full btn-secondary py-4 text-base mt-4">
        Favorite ♡
      </button>
    </div>
  )
}
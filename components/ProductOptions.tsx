'use client'

import { useState } from 'react'
import { Product } from '@/types'
import SizeSelector from './SizeSelector'
import ColorSelector from './ColorSelector'
import AddToCartButton from './AddToCartButton'

interface ProductOptionsProps {
  product: Product
}

export default function ProductOptions({ product }: ProductOptionsProps) {
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColor, setSelectedColor] = useState('')
  const { metadata } = product

  return (
    <div className="space-y-6">
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
        selectedColor={selectedColor}
      />

      <button className="w-full btn-secondary py-4 text-base">
        Favorite ♡
      </button>
    </div>
  )
}
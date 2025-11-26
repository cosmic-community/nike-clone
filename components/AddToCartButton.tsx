'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Product } from '@/types'
import SizeSelector from './SizeSelector'
import ColorSelector from './ColorSelector'

interface AddToCartButtonProps {
  product: Product
  availableSizes?: string[]
  availableColors?: string[]
}

export default function AddToCartButton({ product, availableSizes, availableColors }: AddToCartButtonProps) {
  const router = useRouter()
  const [selectedSize, setSelectedSize] = useState<string | undefined>()
  const [selectedColor, setSelectedColor] = useState<string | undefined>()
  const [isAdding, setIsAdding] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  
  const handleAddToCart = async () => {
    // Validate required selections
    if (availableSizes && availableSizes.length > 0 && !selectedSize) {
      alert('Please select a size')
      return
    }
    
    setIsAdding(true)
    
    try {
      const response = await fetch('/api/cart/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          quantity: 1,
          size: selectedSize,
          color: selectedColor,
        }),
      })
      
      if (response.ok) {
        setShowSuccess(true)
        setTimeout(() => setShowSuccess(false), 3000)
        router.refresh()
      } else {
        alert('Failed to add to cart')
      }
    } catch (error) {
      console.error('Add to cart error:', error)
      alert('Failed to add to cart')
    } finally {
      setIsAdding(false)
    }
  }
  
  return (
    <div>
      {availableColors && availableColors.length > 0 && (
        <div className="mb-6">
          <ColorSelector 
            colors={availableColors} 
            selectedColor={selectedColor}
            onColorSelect={setSelectedColor}
          />
        </div>
      )}

      {availableSizes && availableSizes.length > 0 && (
        <div className="mb-6">
          <SizeSelector 
            sizes={availableSizes}
            selectedSize={selectedSize}
            onSizeSelect={setSelectedSize}
          />
        </div>
      )}

      <button 
        onClick={handleAddToCart}
        disabled={isAdding}
        className="w-full btn-primary py-4 text-base mb-4 disabled:opacity-50"
      >
        {isAdding ? 'Adding...' : 'Add to Bag'}
      </button>
      
      {showSuccess && (
        <div className="bg-green-50 border border-green-200 text-green-800 rounded-lg p-4 mb-4">
          ✓ Added to cart successfully!
        </div>
      )}
    </div>
  )
}
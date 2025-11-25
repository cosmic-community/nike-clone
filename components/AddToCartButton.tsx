'use client'

import { useState } from 'react'
import { useCart } from '@/context/CartContext'
import { Product } from '@/types'

interface AddToCartButtonProps {
  product: Product
  selectedSize: string
  selectedColor: string
}

export default function AddToCartButton({ product, selectedSize, selectedColor }: AddToCartButtonProps) {
  const { addItem } = useCart()
  const [isAdding, setIsAdding] = useState(false)

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      return
    }

    setIsAdding(true)

    addItem({
      productId: product.id,
      productSlug: product.slug,
      name: product.metadata.name,
      price: product.metadata.price,
      salePrice: product.metadata.sale_price,
      image: product.metadata.main_image.imgix_url,
      size: selectedSize,
      color: selectedColor,
      quantity: 1,
    })

    setTimeout(() => {
      setIsAdding(false)
    }, 500)
  }

  const isDisabled = !selectedSize || !selectedColor

  return (
    <button
      onClick={handleAddToCart}
      disabled={isDisabled || isAdding}
      className={`w-full py-4 text-base font-medium rounded-full transition-all ${
        isDisabled
          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
          : isAdding
          ? 'bg-green-600 text-white'
          : 'btn-primary'
      }`}
    >
      {isAdding ? (
        <span className="flex items-center justify-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Added!
        </span>
      ) : isDisabled ? (
        'Select Size & Color'
      ) : (
        'Add to Bag'
      )}
    </button>
  )
}
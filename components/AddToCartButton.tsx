'use client'

import { useState } from 'react'
import { useCart } from '@/context/CartContext'
import { Product } from '@/types'

interface AddToCartButtonProps {
  product: Product
  selectedSize: string
  selectedColor: string
}

export default function AddToCartButton({ 
  product, 
  selectedSize, 
  selectedColor 
}: AddToCartButtonProps) {
  const { addToCart } = useCart()
  const [isAdding, setIsAdding] = useState(false)

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert('Please select a size')
      return
    }
    if (!selectedColor) {
      alert('Please select a color')
      return
    }

    setIsAdding(true)
    
    addToCart({
      productId: product.id,
      productSlug: product.slug,
      name: product.metadata.name,
      subtitle: product.metadata.subtitle,
      price: product.metadata.price,
      salePrice: product.metadata.sale_price,
      image: product.metadata.main_image.imgix_url,
      size: selectedSize,
      color: selectedColor,
      quantity: 1,
    })

    setTimeout(() => setIsAdding(false), 500)
  }

  return (
    <button 
      onClick={handleAddToCart}
      disabled={isAdding}
      className="w-full btn-primary py-4 text-base disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isAdding ? 'Adding...' : 'Add to Bag'}
    </button>
  )
}
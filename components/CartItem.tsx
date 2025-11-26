'use client'

import { useState } from 'react'
import Link from 'next/link'
import { CartItem as CartItemType } from '@/types'
import { useRouter } from 'next/navigation'

interface CartItemProps {
  item: CartItemType
}

export default function CartItem({ item }: CartItemProps) {
  const router = useRouter()
  const [isUpdating, setIsUpdating] = useState(false)
  const { product, quantity, size, color } = item
  const price = product.metadata.sale_price || product.metadata.price
  
  const updateQuantity = async (newQuantity: number) => {
    setIsUpdating(true)
    try {
      const response = await fetch('/api/cart/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          size,
          color,
          quantity: newQuantity,
        }),
      })
      
      if (response.ok) {
        router.refresh()
      }
    } catch (error) {
      console.error('Failed to update quantity:', error)
    } finally {
      setIsUpdating(false)
    }
  }
  
  const removeItem = async () => {
    setIsUpdating(true)
    try {
      const response = await fetch('/api/cart/remove', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          size,
          color,
        }),
      })
      
      if (response.ok) {
        router.refresh()
      }
    } catch (error) {
      console.error('Failed to remove item:', error)
    } finally {
      setIsUpdating(false)
    }
  }
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 flex gap-4">
      <Link href={`/products/${product.slug}`} className="flex-shrink-0">
        <img
          src={`${product.metadata.main_image.imgix_url}?w=400&h=400&fit=crop&auto=format,compress`}
          alt={product.metadata.name}
          className="w-24 h-24 object-cover rounded"
        />
      </Link>
      
      <div className="flex-1">
        <Link href={`/products/${product.slug}`} className="hover:text-nike-gray">
          <h3 className="font-semibold">{product.metadata.name}</h3>
          {product.metadata.subtitle && (
            <p className="text-sm text-gray-600">{product.metadata.subtitle}</p>
          )}
        </Link>
        
        <div className="mt-1 text-sm text-gray-600">
          {size && <span>Size: {size}</span>}
          {size && color && <span className="mx-2">•</span>}
          {color && <span>Color: {color}</span>}
        </div>
        
        <div className="mt-2 flex items-center gap-4">
          <div className="flex items-center border rounded">
            <button
              onClick={() => updateQuantity(quantity - 1)}
              disabled={isUpdating || quantity <= 1}
              className="px-3 py-1 hover:bg-gray-100 disabled:opacity-50"
            >
              -
            </button>
            <span className="px-4 py-1 border-x">{quantity}</span>
            <button
              onClick={() => updateQuantity(quantity + 1)}
              disabled={isUpdating}
              className="px-3 py-1 hover:bg-gray-100 disabled:opacity-50"
            >
              +
            </button>
          </div>
          
          <button
            onClick={removeItem}
            disabled={isUpdating}
            className="text-sm text-red-600 hover:text-red-800 disabled:opacity-50"
          >
            Remove
          </button>
        </div>
      </div>
      
      <div className="text-right">
        <p className="font-semibold">${(price * quantity).toFixed(2)}</p>
        {product.metadata.sale_price && (
          <p className="text-sm text-gray-500 line-through">
            ${(product.metadata.price * quantity).toFixed(2)}
          </p>
        )}
      </div>
    </div>
  )
}
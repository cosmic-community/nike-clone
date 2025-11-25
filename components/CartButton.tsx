'use client'

import { useCart } from '@/context/CartContext'

export default function CartButton() {
  const { toggleCart, itemCount } = useCart()

  return (
    <button 
      onClick={toggleCart}
      className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
      aria-label={`Shopping bag with ${itemCount} items`}
    >
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" 
        />
      </svg>
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-black text-white text-xs rounded-full flex items-center justify-center">
          {itemCount > 99 ? '99+' : itemCount}
        </span>
      )}
    </button>
  )
}
'use client'

import { useCart } from '@/context/CartContext'

export default function CartIcon() {
  const { toggleCart, getCartCount } = useCart()
  const count = getCartCount()

  return (
    <button
      onClick={toggleCart}
      className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
      aria-label={`Shopping bag with ${count} items`}
    >
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
        />
      </svg>
      {count > 0 && (
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-nike-black text-white text-xs rounded-full flex items-center justify-center font-medium">
          {count > 99 ? '99+' : count}
        </span>
      )}
    </button>
  )
}
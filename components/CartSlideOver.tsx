'use client'

import { useCart } from '@/context/CartContext'
import Link from 'next/link'

export default function CartSlideOver() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, getCartTotal, getCartCount } = useCart()

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={closeCart}
      />

      {/* Slide-over panel */}
      <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white z-50 shadow-xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-bold">Your Bag ({getCartCount()})</h2>
          <button
            onClick={closeCart}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close cart"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Cart items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <p className="text-gray-500 mb-4">Your bag is empty</p>
              <button
                onClick={closeCart}
                className="text-nike-black underline hover:no-underline"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <ul className="space-y-6">
              {items.map((item) => {
                const price = item.salePrice ?? item.price
                return (
                  <li key={`${item.productId}-${item.size}-${item.color}`} className="flex gap-4">
                    <Link
                      href={`/products/${item.productSlug}`}
                      onClick={closeCart}
                      className="flex-shrink-0"
                    >
                      <img
                        src={`${item.image}?w=200&h=200&fit=crop&auto=format,compress`}
                        alt={item.name}
                        className="w-24 h-24 object-cover bg-gray-100"
                      />
                    </Link>
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/products/${item.productSlug}`}
                        onClick={closeCart}
                        className="font-medium hover:underline block truncate"
                      >
                        {item.name}
                      </Link>
                      <p className="text-sm text-gray-500 mt-1">
                        {item.color} / Size {item.size}
                      </p>
                      <p className="font-medium mt-1">${price}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <div className="flex items-center border rounded">
                          <button
                            onClick={() => updateQuantity(item.productId, item.size, item.color, item.quantity - 1)}
                            className="px-3 py-1 hover:bg-gray-100 transition-colors"
                            aria-label="Decrease quantity"
                          >
                            -
                          </button>
                          <span className="px-3 py-1 border-x">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.productId, item.size, item.color, item.quantity + 1)}
                            className="px-3 py-1 hover:bg-gray-100 transition-colors"
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>
                        <button
                          onClick={() => removeItem(item.productId, item.size, item.color)}
                          className="text-gray-400 hover:text-gray-600 transition-colors"
                          aria-label="Remove item"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t px-6 py-4 space-y-4">
            <div className="flex justify-between text-lg font-bold">
              <span>Subtotal</span>
              <span>${getCartTotal().toFixed(2)}</span>
            </div>
            <p className="text-sm text-gray-500">Shipping and taxes calculated at checkout</p>
            <div className="space-y-3">
              <Link
                href="/cart"
                onClick={closeCart}
                className="block w-full btn-secondary py-3 text-center"
              >
                View Bag
              </Link>
              <Link
                href="/checkout"
                onClick={closeCart}
                className="block w-full btn-primary py-3 text-center"
              >
                Checkout
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
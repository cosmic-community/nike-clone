'use client'

import Link from 'next/link'
import { useCart } from '@/context/CartContext'

export default function CartPageContent() {
  const { items, removeItem, updateQuantity, getCartTotal, getCartCount } = useCart()

  const subtotal = getCartTotal()
  const shipping = subtotal > 150 ? 0 : 8
  const estimatedTax = subtotal * 0.08
  const total = subtotal + shipping + estimatedTax

  if (items.length === 0) {
    return (
      <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Bag</h1>
        <div className="text-center py-16">
          <svg className="w-24 h-24 mx-auto text-gray-300 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <h2 className="text-xl font-medium mb-2">Your bag is empty</h2>
          <p className="text-gray-500 mb-6">Looks like you haven&apos;t added any items to your bag yet.</p>
          <Link href="/products" className="btn-primary px-8 py-3 inline-block">
            Continue Shopping
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Bag</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="divide-y">
            {items.map((item) => {
              const price = item.salePrice ?? item.price
              return (
                <div
                  key={`${item.productId}-${item.size}-${item.color}`}
                  className="py-6 flex gap-6"
                >
                  <Link href={`/products/${item.productSlug}`} className="flex-shrink-0">
                    <img
                      src={`${item.image}?w=300&h=300&fit=crop&auto=format,compress`}
                      alt={item.name}
                      className="w-32 h-32 object-cover bg-gray-100"
                    />
                  </Link>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <div>
                        <Link
                          href={`/products/${item.productSlug}`}
                          className="font-medium text-lg hover:underline"
                        >
                          {item.name}
                        </Link>
                        <p className="text-gray-500 mt-1">
                          {item.color} / Size {item.size}
                        </p>
                      </div>
                      <p className="font-medium text-lg">${(price * item.quantity).toFixed(2)}</p>
                    </div>
                    <div className="flex items-center gap-4 mt-4">
                      <div className="flex items-center border rounded">
                        <button
                          onClick={() => updateQuantity(item.productId, item.size, item.color, item.quantity - 1)}
                          className="px-4 py-2 hover:bg-gray-100 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          -
                        </button>
                        <span className="px-4 py-2 border-x font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.size, item.color, item.quantity + 1)}
                          className="px-4 py-2 hover:bg-gray-100 transition-colors"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.productId, item.size, item.color)}
                        className="text-gray-400 hover:text-gray-600 transition-colors p-2"
                        aria-label="Remove item"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-gray-50 rounded-lg p-6 sticky top-24">
            <h2 className="text-xl font-bold mb-6">Summary</h2>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal ({getCartCount()} items)</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Estimated Shipping</span>
                <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Estimated Tax</span>
                <span>${estimatedTax.toFixed(2)}</span>
              </div>
              <div className="border-t pt-4 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
            {subtotal < 150 && (
              <p className="text-sm text-gray-500 mt-4">
                Free shipping on orders over $150. Add ${(150 - subtotal).toFixed(2)} more to qualify.
              </p>
            )}
            <Link
              href="/checkout"
              className="w-full btn-primary py-4 text-center block mt-6"
            >
              Checkout
            </Link>
            <Link
              href="/products"
              className="w-full btn-secondary py-4 text-center block mt-3"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
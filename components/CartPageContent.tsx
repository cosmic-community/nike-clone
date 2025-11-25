'use client'

import Link from 'next/link'
import { useCart } from '@/context/CartContext'
import { calculateShipping, calculateTax } from '@/lib/cart'

export default function CartPageContent() {
  const { 
    cart, 
    subtotal, 
    itemCount,
    updateQuantity,
    removeFromCart
  } = useCart()

  const shipping = calculateShipping(subtotal)
  const tax = calculateTax(subtotal)
  const total = subtotal + shipping + tax

  if (cart.items.length === 0) {
    return (
      <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <h1 className="text-3xl font-bold mb-4">Your Bag is Empty</h1>
        <p className="text-nike-gray mb-8">
          Looks like you haven&apos;t added any items to your bag yet.
        </p>
        <Link href="/products" className="btn-primary inline-block px-8">
          Continue Shopping
        </Link>
      </div>
    )
  }

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Bag</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="space-y-6">
            {cart.items.map((item, index) => (
              <div 
                key={`${item.productId}-${item.size}-${item.color}-${index}`} 
                className="flex gap-6 pb-6 border-b"
              >
                <Link 
                  href={`/products/${item.productSlug}`}
                  className="w-32 h-32 flex-shrink-0 bg-nike-lightgray"
                >
                  <img 
                    src={`${item.image}?w=300&h=300&fit=crop&auto=format,compress`}
                    alt={item.name}
                    className="w-full h-full object-cover"
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
                      {item.subtitle && (
                        <p className="text-nike-gray">{item.subtitle}</p>
                      )}
                      <p className="text-nike-gray">
                        Size: {item.size}
                      </p>
                      <p className="text-nike-gray">
                        Color: {item.color}
                      </p>
                    </div>
                    <p className="font-medium text-lg">
                      ${((item.salePrice ?? item.price) * item.quantity).toFixed(2)}
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center border rounded-full">
                        <button
                          onClick={() => updateQuantity(item.productId, item.size, item.color, item.quantity - 1)}
                          className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-l-full transition-colors"
                          aria-label="Decrease quantity"
                        >
                          -
                        </button>
                        <span className="w-10 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.size, item.color, item.quantity + 1)}
                          className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-r-full transition-colors"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => removeFromCart(item.productId, item.size, item.color)}
                      className="flex items-center gap-2 text-nike-gray hover:text-black transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-nike-lightgray p-6 rounded-lg sticky top-24">
            <h2 className="text-xl font-bold mb-6">Summary</h2>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span>Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'items'})</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Shipping</span>
                <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-base pt-4 border-t border-gray-300">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            {subtotal < 100 && (
              <p className="text-sm text-nike-gray text-center mt-4">
                Add ${(100 - subtotal).toFixed(2)} more for free shipping
              </p>
            )}
            
            <Link 
              href="/checkout"
              className="btn-primary w-full py-4 text-center block mt-6"
            >
              Checkout
            </Link>
            
            <Link 
              href="/products"
              className="btn-secondary w-full py-4 text-center block mt-3"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
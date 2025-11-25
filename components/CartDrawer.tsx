'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { useCart } from '@/context/CartContext'
import { calculateShipping, calculateTax } from '@/lib/cart'

export default function CartDrawer() {
  const { 
    cart, 
    isCartOpen, 
    closeCart, 
    subtotal, 
    itemCount,
    updateQuantity,
    removeFromCart
  } = useCart()

  // Prevent body scroll when cart is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isCartOpen])

  const shipping = calculateShipping(subtotal)
  const tax = calculateTax(subtotal)
  const total = subtotal + shipping + tax

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
          isCartOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeCart}
      />
      
      {/* Drawer */}
      <div 
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 transform transition-transform duration-300 ease-in-out ${
          isCartOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-xl font-bold">Bag ({itemCount})</h2>
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
          
          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4">
            {cart.items.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-nike-gray mb-4">Your bag is empty</p>
                <Link 
                  href="/products"
                  onClick={closeCart}
                  className="btn-primary inline-block px-8"
                >
                  Shop Now
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.items.map((item, index) => (
                  <div key={`${item.productId}-${item.size}-${item.color}-${index}`} className="flex gap-4 pb-4 border-b">
                    <Link 
                      href={`/products/${item.productSlug}`}
                      onClick={closeCart}
                      className="w-24 h-24 flex-shrink-0 bg-nike-lightgray"
                    >
                      <img 
                        src={`${item.image}?w=200&h=200&fit=crop&auto=format,compress`}
                        alt={item.name}
                        className="w-full h-full object-cover"
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
                      {item.subtitle && (
                        <p className="text-sm text-nike-gray">{item.subtitle}</p>
                      )}
                      <p className="text-sm text-nike-gray">
                        Size: {item.size} | Color: {item.color}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.productId, item.size, item.color, item.quantity - 1)}
                            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-black transition-colors"
                            aria-label="Decrease quantity"
                          >
                            -
                          </button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.productId, item.size, item.color, item.quantity + 1)}
                            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-black transition-colors"
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.productId, item.size, item.color)}
                          className="text-nike-gray hover:text-black transition-colors"
                          aria-label="Remove item"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                      <p className="font-medium mt-2">
                        ${((item.salePrice ?? item.price) * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Footer */}
          {cart.items.length > 0 && (
            <div className="border-t p-4 space-y-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal</span>
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
                <div className="flex justify-between font-bold text-base pt-2 border-t">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
              
              {subtotal < 100 && (
                <p className="text-sm text-nike-gray text-center">
                  Add ${(100 - subtotal).toFixed(2)} more for free shipping
                </p>
              )}
              
              <Link 
                href="/checkout"
                onClick={closeCart}
                className="btn-primary w-full py-4 text-center block"
              >
                Checkout
              </Link>
              
              <Link 
                href="/cart"
                onClick={closeCart}
                className="btn-secondary w-full py-4 text-center block"
              >
                View Bag
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
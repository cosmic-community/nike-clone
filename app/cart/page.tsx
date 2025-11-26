import { Metadata } from 'next'
import Link from 'next/link'
import { getCart, getCartTotal } from '@/lib/cart'
import CartItem from '@/components/CartItem'
import { generateSEO } from '@/lib/seo'

export const metadata: Metadata = generateSEO({
  title: 'Shopping Cart | Nike Clone',
  description: 'Review your shopping cart and proceed to checkout',
  path: '/cart',
})

export default async function CartPage() {
  const cart = await getCart()
  const totals = await getCartTotal()
  
  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <svg className="mx-auto h-24 w-24 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <h2 className="mt-6 text-3xl font-bold">Your cart is empty</h2>
          <p className="mt-2 text-gray-600">Start shopping to add items to your cart.</p>
          <Link 
            href="/products" 
            className="mt-8 inline-block btn-primary px-8 py-3"
          >
            Shop Now
          </Link>
        </div>
      </div>
    )
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {cart.map((item, index) => (
              <CartItem key={`${item.product.id}-${item.size}-${item.color}-${index}`} item={item} />
            ))}
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <div className="bg-gray-50 rounded-lg p-6 sticky top-24">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">${totals.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">
                  {totals.shipping === 0 ? 'Free' : `$${totals.shipping.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax</span>
                <span className="font-medium">${totals.tax.toFixed(2)}</span>
              </div>
              <div className="border-t pt-3 flex justify-between">
                <span className="text-lg font-bold">Total</span>
                <span className="text-lg font-bold">${totals.total.toFixed(2)}</span>
              </div>
            </div>
            
            {totals.subtotal < 150 && (
              <p className="text-sm text-gray-600 mb-4">
                Add ${(150 - totals.subtotal).toFixed(2)} more for free shipping!
              </p>
            )}
            
            <Link 
              href="/checkout" 
              className="block w-full btn-primary text-center py-3 mb-3"
            >
              Proceed to Checkout
            </Link>
            
            <Link 
              href="/products" 
              className="block w-full btn-secondary text-center py-3"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
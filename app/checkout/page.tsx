import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getCart, getCartTotal } from '@/lib/cart'
import CheckoutForm from '@/components/CheckoutForm'
import { generateSEO } from '@/lib/seo'

export const metadata: Metadata = generateSEO({
  title: 'Checkout | Nike Clone',
  description: 'Complete your order',
  path: '/checkout',
})

export default async function CheckoutPage() {
  const cart = await getCart()
  const totals = await getCartTotal()
  
  if (cart.length === 0) {
    redirect('/cart')
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <CheckoutForm />
        </div>
        
        <div className="lg:col-span-1">
          <div className="bg-gray-50 rounded-lg p-6 sticky top-24">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            
            <div className="space-y-3 mb-6">
              {cart.map((item, index) => (
                <div key={`${item.product.id}-${item.size}-${item.color}-${index}`} className="flex justify-between text-sm">
                  <div className="flex-1">
                    <p className="font-medium">{item.product.metadata.name}</p>
                    <p className="text-gray-600">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-medium">
                    ${((item.product.metadata.sale_price || item.product.metadata.price) * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
            
            <div className="border-t pt-3 space-y-2">
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
              <div className="border-t pt-2 flex justify-between">
                <span className="text-lg font-bold">Total</span>
                <span className="text-lg font-bold">${totals.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
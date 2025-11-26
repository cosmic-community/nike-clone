import { Metadata } from 'next'
import Link from 'next/link'
import { generateSEO } from '@/lib/seo'

export const metadata: Metadata = generateSEO({
  title: 'Order Confirmed | Nike Clone',
  description: 'Your order has been confirmed',
  path: '/checkout/success',
})

export default function CheckoutSuccessPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
      <div className="bg-white rounded-lg shadow-lg p-12">
        <div className="mb-6">
          <svg className="mx-auto h-24 w-24 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        
        <h1 className="text-3xl font-bold mb-4">Order Confirmed!</h1>
        <p className="text-gray-600 mb-8">
          Thank you for your purchase. Your order has been received and is being processed.
          You will receive an email confirmation shortly.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/profile" className="btn-primary px-8 py-3">
            View Orders
          </Link>
          <Link href="/products" className="btn-secondary px-8 py-3">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  )
}
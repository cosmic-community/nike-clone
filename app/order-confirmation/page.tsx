import { Metadata } from 'next'
import { Suspense } from 'react'
import OrderConfirmationContent from '@/components/OrderConfirmationContent'
import { generateSEO } from '@/lib/seo'

export const metadata: Metadata = generateSEO({
  title: 'Order Confirmation | Nike Clone',
  description: 'Thank you for your order!',
  path: '/order-confirmation',
})

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={
      <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto text-center">
        <div className="animate-spin h-12 w-12 border-4 border-nike-black border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-gray-500">Loading your order details...</p>
      </div>
    }>
      <OrderConfirmationContent />
    </Suspense>
  )
}
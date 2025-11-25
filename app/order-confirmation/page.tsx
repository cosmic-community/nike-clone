import { Metadata } from 'next'
import OrderConfirmationContent from '@/components/OrderConfirmationContent'
import { generateSEO } from '@/lib/seo'

export const metadata: Metadata = generateSEO({
  title: 'Order Confirmation | Nike Clone',
  description: 'Thank you for your order!',
  path: '/order-confirmation',
})

export default function OrderConfirmationPage() {
  return <OrderConfirmationContent />
}
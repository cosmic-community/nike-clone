import { Metadata } from 'next'
import CheckoutForm from '@/components/CheckoutForm'
import { generateSEO } from '@/lib/seo'

export const metadata: Metadata = generateSEO({
  title: 'Checkout | Nike Clone',
  description: 'Complete your purchase securely with Stripe.',
  path: '/checkout',
})

export default function CheckoutPage() {
  return <CheckoutForm />
}
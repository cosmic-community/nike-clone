import { Metadata } from 'next'
import CheckoutForm from '@/components/CheckoutForm'
import { getStripePublishableKey } from '@/lib/stripe'

export const metadata: Metadata = {
  title: 'Checkout | Nike Clone',
  description: 'Complete your purchase securely.',
}

export default function CheckoutPage() {
  const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      <CheckoutForm stripePublishableKey={stripePublishableKey} />
    </div>
  )
}
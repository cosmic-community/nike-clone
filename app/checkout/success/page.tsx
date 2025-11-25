import { Metadata } from 'next'
import Link from 'next/link'
import { stripe } from '@/lib/stripe'
import { createOrder, getOrderByStripeSession } from '@/lib/cosmic'
import { OrderItem } from '@/types'
import ClearCartOnSuccess from '@/components/ClearCartOnSuccess'

export const metadata: Metadata = {
  title: 'Order Confirmed | Nike Clone',
  description: 'Thank you for your order!',
}

interface SuccessPageProps {
  searchParams: Promise<{ session_id?: string }>
}

export default async function CheckoutSuccessPage({ searchParams }: SuccessPageProps) {
  const params = await searchParams
  const sessionId = params.session_id

  if (!sessionId) {
    return (
      <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto text-center">
        <h1 className="text-3xl font-bold mb-4">Order Not Found</h1>
        <p className="text-nike-gray mb-8">
          We couldn&apos;t find your order. Please contact support if you need assistance.
        </p>
        <Link href="/products" className="btn-primary inline-block px-8">
          Continue Shopping
        </Link>
      </div>
    )
  }

  try {
    // Retrieve the checkout session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items', 'payment_intent'],
    })

    // Check if order already exists
    let order = await getOrderByStripeSession(sessionId)

    // If order doesn't exist, create it (backup for webhook)
    if (!order && session.payment_status === 'paid') {
      let items: OrderItem[] = []
      if (session.metadata?.items_json) {
        try {
          items = JSON.parse(session.metadata.items_json)
        } catch (e) {
          console.error('Failed to parse items_json:', e)
        }
      }

      order = await createOrder({
        customer_email: session.customer_email || session.customer_details?.email || '',
        customer_name: session.metadata?.customer_name || session.customer_details?.name || '',
        shipping_address: session.metadata?.shipping_address || '',
        items,
        subtotal: parseFloat(session.metadata?.subtotal || '0'),
        shipping: parseFloat(session.metadata?.shipping || '0'),
        tax: parseFloat(session.metadata?.tax || '0'),
        total: (session.amount_total || 0) / 100,
        stripe_payment_intent_id: typeof session.payment_intent === 'string' 
          ? session.payment_intent 
          : (session.payment_intent as { id: string })?.id || '',
        stripe_session_id: session.id,
      })
    }

    const orderNumber = order?.id?.slice(-8).toUpperCase() || sessionId.slice(-8).toUpperCase()
    const total = (session.amount_total || 0) / 100

    return (
      <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto">
        <ClearCartOnSuccess />
        
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold mb-2">Thank You!</h1>
          <p className="text-nike-gray text-lg">Your order has been confirmed</p>
        </div>

        <div className="bg-nike-lightgray p-6 rounded-lg mb-8">
          <div className="grid grid-cols-2 gap-6 text-sm">
            <div>
              <p className="text-nike-gray mb-1">Order Number</p>
              <p className="font-bold">#{orderNumber}</p>
            </div>
            <div>
              <p className="text-nike-gray mb-1">Order Total</p>
              <p className="font-bold">${total.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-nike-gray mb-1">Email</p>
              <p className="font-medium">{session.customer_email || session.customer_details?.email}</p>
            </div>
            <div>
              <p className="text-nike-gray mb-1">Payment Status</p>
              <p className="font-medium capitalize text-green-600">{session.payment_status}</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 p-6 rounded-lg mb-8">
          <h2 className="font-bold text-lg mb-4">What&apos;s Next?</h2>
          <ul className="space-y-3 text-sm text-nike-gray">
            <li className="flex items-start gap-3">
              <svg className="w-5 h-5 text-black flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span>You&apos;ll receive an order confirmation email shortly.</span>
            </li>
            <li className="flex items-start gap-3">
              <svg className="w-5 h-5 text-black flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
              <span>Your order will be processed and shipped within 2-3 business days.</span>
            </li>
            <li className="flex items-start gap-3">
              <svg className="w-5 h-5 text-black flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>You&apos;ll receive shipping updates via email with tracking information.</span>
            </li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/products" className="btn-primary px-8 text-center">
            Continue Shopping
          </Link>
          <Link href="/" className="btn-secondary px-8 text-center">
            Return Home
          </Link>
        </div>
      </div>
    )
  } catch (error) {
    console.error('Error fetching checkout session:', error)
    return (
      <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto text-center">
        <h1 className="text-3xl font-bold mb-4">Something Went Wrong</h1>
        <p className="text-nike-gray mb-8">
          We couldn&apos;t verify your order. Please contact support with your payment confirmation.
        </p>
        <Link href="/products" className="btn-primary inline-block px-8">
          Continue Shopping
        </Link>
      </div>
    )
  }
}
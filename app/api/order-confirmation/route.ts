import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createOrder } from '@/lib/cosmic'
import { OrderItem } from '@/types'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2023-10-16', // Changed: Fixed API version to match TypeScript type definition
})

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const sessionId = searchParams.get('session_id')

  if (!sessionId) {
    return NextResponse.json(
      { error: 'Session ID is required' },
      { status: 400 }
    )
  }

  try {
    // Retrieve the checkout session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['payment_intent'],
    })

    if (session.payment_status !== 'paid') {
      return NextResponse.json(
        { error: 'Payment not completed' },
        { status: 400 }
      )
    }

    // Parse the metadata
    const metadata = session.metadata || {}
    const items: OrderItem[] = JSON.parse(metadata.items || '[]')

    // Create order in Cosmic
    try {
      await createOrder({
        customerEmail: session.customer_email || '',
        customerName: metadata.customerName || '',
        shippingAddress: metadata.shippingAddress || '',
        items,
        subtotal: parseFloat(metadata.subtotal || '0'),
        shipping: parseFloat(metadata.shipping || '0'),
        tax: parseFloat(metadata.tax || '0'),
        total: parseFloat(metadata.total || '0'),
        stripePaymentIntentId: typeof session.payment_intent === 'string' 
          ? session.payment_intent 
          : session.payment_intent?.id || '',
        stripeSessionId: sessionId,
      })
    } catch (cosmicError) {
      console.error('Failed to create order in Cosmic:', cosmicError)
      // Continue anyway - payment was successful
    }

    return NextResponse.json({
      id: sessionId,
      email: session.customer_email,
      total: parseFloat(metadata.total || '0'),
      items: items.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        size: item.size,
        color: item.color,
      })),
    })
  } catch (error) {
    console.error('Order confirmation error:', error)
    return NextResponse.json(
      { error: 'Failed to retrieve order details' },
      { status: 500 }
    )
  }
}
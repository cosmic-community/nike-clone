import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createOrder, updateOrderStatus, getOrderByStripeSession } from '@/lib/cosmic'
import { OrderItem } from '@/types'
import Stripe from 'stripe'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing stripe-signature header' },
      { status: 400 }
    )
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!webhookSecret) {
    console.error('STRIPE_WEBHOOK_SECRET is not set')
    return NextResponse.json(
      { error: 'Webhook secret not configured' },
      { status: 500 }
    )
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error'
    console.error('Webhook signature verification failed:', errorMessage)
    return NextResponse.json(
      { error: `Webhook Error: ${errorMessage}` },
      { status: 400 }
    )
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        
        // Check if order already exists
        const existingOrder = await getOrderByStripeSession(session.id)
        if (existingOrder) {
          console.log('Order already exists for session:', session.id)
          break
        }

        // Parse items from metadata
        let items: OrderItem[] = []
        if (session.metadata?.items_json) {
          try {
            items = JSON.parse(session.metadata.items_json)
          } catch (e) {
            console.error('Failed to parse items_json:', e)
          }
        }

        // Create order in Cosmic
        await createOrder({
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
            : session.payment_intent?.id || '',
          stripe_session_id: session.id,
        })

        console.log('Order created for session:', session.id)
        break
      }

      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        console.log('Payment succeeded:', paymentIntent.id)
        break
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        console.error('Payment failed:', paymentIntent.id, paymentIntent.last_payment_error?.message)
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook handler error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}
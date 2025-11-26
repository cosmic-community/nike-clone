import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createOrder } from '@/lib/cosmic'
import { headers } from 'next/headers'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2025-02-24.acacia',
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET as string

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const headersList = await headers()
    const signature = headersList.get('stripe-signature')
    
    if (!signature) {
      return NextResponse.json(
        { error: 'Missing stripe signature' },
        { status: 400 }
      )
    }
    
    let event: Stripe.Event
    
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      console.error('Webhook signature verification failed:', err)
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      )
    }
    
    // Handle the checkout.session.completed event
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session
      
      // Get line items
      const lineItems = await stripe.checkout.sessions.listLineItems(session.id)
      
      // Create order in Cosmic
      await createOrder({
        customer_email: session.customer_email || session.metadata?.customer_email || '',
        customer_name: session.metadata?.customer_name || '',
        shipping_address: session.metadata?.shipping_address || '',
        items: lineItems.data.map(item => ({
          product_id: item.price?.product as string,
          product_name: item.description || '',
          product_image: undefined,
          quantity: item.quantity || 1,
          size: undefined,
          color: undefined,
          price: (item.amount_total || 0) / 100,
        })),
        subtotal: parseFloat(session.metadata?.subtotal || '0'),
        shipping: parseFloat(session.metadata?.shipping || '0'),
        tax: (session.total_details?.amount_tax || 0) / 100,
        total: (session.amount_total || 0) / 100,
        status: 'Pending',
        stripe_payment_intent_id: session.payment_intent as string,
        stripe_session_id: session.id,
      })
    }
    
    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}
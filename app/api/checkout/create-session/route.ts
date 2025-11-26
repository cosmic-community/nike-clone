import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { getCart, getCartTotal } from '@/lib/cart'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2024-11-20.acacia',
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { customerEmail, customerName, shippingAddress } = body
    
    if (!customerEmail || !customerName || !shippingAddress) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }
    
    // Get cart items
    const cart = await getCart()
    if (cart.length === 0) {
      return NextResponse.json(
        { error: 'Cart is empty' },
        { status: 400 }
      )
    }
    
    const totals = await getCartTotal()
    
    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: cart.map(item => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.product.metadata.name,
            description: item.size || item.color ? `Size: ${item.size || 'N/A'}, Color: ${item.color || 'N/A'}` : undefined,
            images: [item.product.metadata.main_image.imgix_url],
          },
          unit_amount: Math.round((item.product.metadata.sale_price || item.product.metadata.price) * 100),
        },
        quantity: item.quantity,
      })),
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/cart`,
      customer_email: customerEmail,
      metadata: {
        customer_name: customerName,
        shipping_address: shippingAddress,
        subtotal: totals.subtotal.toFixed(2),
        shipping: totals.shipping.toFixed(2),
        tax: totals.tax.toFixed(2),
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: {
              amount: Math.round(totals.shipping * 100),
              currency: 'usd',
            },
            display_name: totals.shipping === 0 ? 'Free Shipping' : 'Standard Shipping',
            delivery_estimate: {
              minimum: {
                unit: 'business_day',
                value: 5,
              },
              maximum: {
                unit: 'business_day',
                value: 7,
              },
            },
          },
        },
      ],
    })
    
    return NextResponse.json({ sessionId: session.id, url: session.url })
  } catch (error) {
    console.error('Checkout session error:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
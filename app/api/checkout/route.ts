import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { CartItem } from '@/types'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2024-11-20.acacia',
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      items,
      customerEmail,
      customerName,
      shippingAddress,
      subtotal,
      shipping,
      tax,
      total,
    } = body as {
      items: CartItem[]
      customerEmail: string
      customerName: string
      shippingAddress: string
      subtotal: number
      shipping: number
      tax: number
      total: number
    }

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'No items in cart' },
        { status: 400 }
      )
    }

    // Create line items for Stripe
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = items.map((item) => {
      const unitPrice = item.salePrice ?? item.price
      return {
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.name,
            description: `${item.color} / Size ${item.size}`,
            images: [`${item.image}?w=400&h=400&fit=crop&auto=format,compress`],
          },
          unit_amount: Math.round(unitPrice * 100), // Stripe expects cents
        },
        quantity: item.quantity,
      }
    })

    // Add shipping as a line item if not free
    if (shipping > 0) {
      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Shipping',
            description: 'Standard shipping',
          },
          unit_amount: Math.round(shipping * 100),
        },
        quantity: 1,
      })
    }

    // Add tax as a line item
    if (tax > 0) {
      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Tax',
            description: 'Estimated sales tax',
          },
          unit_amount: Math.round(tax * 100),
        },
        quantity: 1,
      })
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      customer_email: customerEmail,
      success_url: `${siteUrl}/order-confirmation?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/checkout`,
      metadata: {
        customerName,
        shippingAddress,
        subtotal: subtotal.toString(),
        shipping: shipping.toString(),
        tax: tax.toString(),
        total: total.toString(),
        items: JSON.stringify(
          items.map((item) => ({
            productId: item.productId,
            productSlug: item.productSlug,
            name: item.name,
            price: item.salePrice ?? item.price,
            size: item.size,
            color: item.color,
            quantity: item.quantity,
            image: item.image,
          }))
        ),
      },
    })

    return NextResponse.json({ url: session.url, sessionId: session.id })
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { CartItem } from '@/types'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2023-10-16', // Changed: Fixed to match TypeScript type definitions
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { items, customerInfo } = body as {
      items: CartItem[]
      customerInfo: {
        name: string
        email: string
        address: string
        city: string
        state: string
        zipCode: string
        country: string
      }
    }

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'No items in cart' },
        { status: 400 }
      )
    }

    // Calculate totals
    const subtotal = items.reduce((sum, item) => {
      const price = item.salePrice || item.price
      return sum + (price * item.quantity)
    }, 0)
    const shipping = 10.00 // Flat shipping rate
    const tax = subtotal * 0.08 // 8% tax
    const total = subtotal + shipping + tax

    // Create line items for Stripe
    const lineItems = items.map((item) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.name,
          images: [item.image],
          description: `Size: ${item.size} / Color: ${item.color}`,
        },
        unit_amount: Math.round((item.salePrice || item.price) * 100),
      },
      quantity: item.quantity,
    }))

    // Add shipping as a line item
    lineItems.push({
      price_data: {
        currency: 'usd',
        product_data: {
          name: 'Shipping',
        },
        unit_amount: Math.round(shipping * 100),
      },
      quantity: 1,
    })

    // Add tax as a line item
    lineItems.push({
      price_data: {
        currency: 'usd',
        product_data: {
          name: 'Tax',
        },
        unit_amount: Math.round(tax * 100),
      },
      quantity: 1,
    })

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/order-confirmation?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/checkout`,
      customer_email: customerInfo.email,
      metadata: {
        customerName: customerInfo.name,
        shippingAddress: `${customerInfo.address}, ${customerInfo.city}, ${customerInfo.state} ${customerInfo.zipCode}, ${customerInfo.country}`,
        items: JSON.stringify(items.map(item => ({
          productId: item.productId,
          productSlug: item.productSlug,
          name: item.name,
          price: item.salePrice || item.price,
          size: item.size,
          color: item.color,
          quantity: item.quantity,
          image: item.image,
        }))),
        subtotal: subtotal.toFixed(2),
        shipping: shipping.toFixed(2),
        tax: tax.toFixed(2),
        total: total.toFixed(2),
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
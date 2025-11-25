import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { CartItem, CheckoutFormData } from '@/types'

interface CheckoutRequestBody {
  items: CartItem[]
  customerInfo: CheckoutFormData
  subtotal: number
  shipping: number
  tax: number
  total: number
}

export async function POST(request: NextRequest) {
  try {
    const body: CheckoutRequestBody = await request.json()
    const { items, customerInfo, subtotal, shipping, tax, total } = body

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'Cart is empty' },
        { status: 400 }
      )
    }

    // Create line items for Stripe
    const lineItems = items.map((item) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.name,
          description: `Size: ${item.size} | Color: ${item.color}`,
          images: [`${item.image}?w=400&h=400&fit=crop&auto=format,compress`],
        },
        unit_amount: Math.round((item.salePrice ?? item.price) * 100), // Convert to cents
      },
      quantity: item.quantity,
    }))

    // Add shipping as a line item if not free
    if (shipping > 0) {
      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Shipping',
            description: 'Standard shipping',
            images: [],
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
            description: 'Sales tax',
            images: [],
          },
          unit_amount: Math.round(tax * 100),
        },
        quantity: 1,
      })
    }

    // Get the base URL for redirects
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 
      (request.headers.get('host')?.includes('localhost') 
        ? `http://${request.headers.get('host')}`
        : `https://${request.headers.get('host')}`)

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/checkout`,
      customer_email: customerInfo.email,
      shipping_address_collection: {
        allowed_countries: ['US', 'CA', 'GB', 'AU'],
      },
      metadata: {
        customer_name: `${customerInfo.firstName} ${customerInfo.lastName}`,
        shipping_address: `${customerInfo.address}, ${customerInfo.city}, ${customerInfo.state} ${customerInfo.zipCode}, ${customerInfo.country}`,
        items_json: JSON.stringify(items.map(item => ({
          product_id: item.productId,
          product_slug: item.productSlug,
          name: item.name,
          price: item.salePrice ?? item.price,
          size: item.size,
          color: item.color,
          quantity: item.quantity,
          image: item.image,
        }))),
        subtotal: subtotal.toString(),
        shipping: shipping.toString(),
        tax: tax.toString(),
        total: total.toString(),
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
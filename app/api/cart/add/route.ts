import { NextRequest, NextResponse } from 'next/server'
import { getProductById } from '@/lib/cosmic'
import { addToCart } from '@/lib/cart'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { productId, quantity = 1, size, color } = body
    
    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      )
    }
    
    // Get product details
    const product = await getProductById(productId)
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }
    
    // Add to cart
    await addToCart(product, quantity, size, color)
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Add to cart error:', error)
    return NextResponse.json(
      { error: 'Failed to add to cart' },
      { status: 500 }
    )
  }
}
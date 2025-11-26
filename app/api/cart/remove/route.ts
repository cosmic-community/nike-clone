import { NextRequest, NextResponse } from 'next/server'
import { removeFromCart } from '@/lib/cart'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { productId, size, color } = body
    
    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      )
    }
    
    await removeFromCart(productId, size, color)
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Remove from cart error:', error)
    return NextResponse.json(
      { error: 'Failed to remove from cart' },
      { status: 500 }
    )
  }
}
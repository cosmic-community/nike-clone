import { NextRequest, NextResponse } from 'next/server'
import { updateCartItemQuantity } from '@/lib/cart'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { productId, size, color, quantity } = body
    
    if (!productId || quantity === undefined) {
      return NextResponse.json(
        { error: 'Product ID and quantity are required' },
        { status: 400 }
      )
    }
    
    await updateCartItemQuantity(productId, size, color, quantity)
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Update cart error:', error)
    return NextResponse.json(
      { error: 'Failed to update cart' },
      { status: 500 }
    )
  }
}
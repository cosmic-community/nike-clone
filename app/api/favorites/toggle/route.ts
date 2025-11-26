import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { addFavoriteProduct, removeFavoriteProduct, getUserById } from '@/lib/cosmic'

export async function POST(request: NextRequest) {
  try {
    const user = await getSession()
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized - Please log in' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { productId } = body

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      )
    }

    // Get current user data to check if product is already favorited
    const currentUser = await getUserById(user.id)
    
    if (!currentUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const currentFavorites = currentUser.metadata.favorite_products || []
    const isFavorite = currentFavorites.includes(productId)

    // Toggle favorite status
    if (isFavorite) {
      await removeFavoriteProduct(user.id, productId)
      return NextResponse.json({
        success: true,
        isFavorite: false,
        message: 'Removed from favorites'
      })
    } else {
      await addFavoriteProduct(user.id, productId)
      return NextResponse.json({
        success: true,
        isFavorite: true,
        message: 'Added to favorites'
      })
    }
  } catch (error) {
    console.error('Toggle favorite error:', error)
    return NextResponse.json(
      { error: 'Failed to update favorites' },
      { status: 500 }
    )
  }
}
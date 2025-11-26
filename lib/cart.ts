import { cookies } from 'next/headers'
import { CartItem, Product } from '@/types'

const CART_COOKIE_NAME = 'nike_cart'
const CART_EXPIRY_DAYS = 7

export async function getCart(): Promise<CartItem[]> {
  const cookieStore = await cookies()
  const cartCookie = cookieStore.get(CART_COOKIE_NAME)
  
  if (!cartCookie) {
    return []
  }
  
  try {
    return JSON.parse(cartCookie.value)
  } catch {
    return []
  }
}

export async function addToCart(product: Product, quantity: number = 1, size?: string, color?: string): Promise<void> {
  const cookieStore = await cookies()
  const cart = await getCart()
  
  // Check if item already exists in cart
  const existingItemIndex = cart.findIndex(
    item => 
      item.product.id === product.id && 
      item.size === size && 
      item.color === color
  )
  
  if (existingItemIndex > -1) {
    // Update quantity - validate index exists
    const existingItem = cart[existingItemIndex]
    if (existingItem) {
      existingItem.quantity += quantity
    }
  } else {
    // Add new item
    cart.push({
      product,
      quantity,
      size,
      color,
    })
  }
  
  // Save to cookie
  cookieStore.set(CART_COOKIE_NAME, JSON.stringify(cart), {
    maxAge: 60 * 60 * 24 * CART_EXPIRY_DAYS,
    path: '/',
  })
}

export async function updateCartItemQuantity(productId: string, size: string | undefined, color: string | undefined, quantity: number): Promise<void> {
  const cookieStore = await cookies()
  const cart = await getCart()
  
  const itemIndex = cart.findIndex(
    item => 
      item.product.id === productId && 
      item.size === size && 
      item.color === color
  )
  
  if (itemIndex > -1) {
    if (quantity <= 0) {
      // Remove item
      cart.splice(itemIndex, 1)
    } else {
      // Update quantity - validate index exists
      const item = cart[itemIndex]
      if (item) {
        item.quantity = quantity
      }
    }
    
    cookieStore.set(CART_COOKIE_NAME, JSON.stringify(cart), {
      maxAge: 60 * 60 * 24 * CART_EXPIRY_DAYS,
      path: '/',
    })
  }
}

export async function removeFromCart(productId: string, size: string | undefined, color: string | undefined): Promise<void> {
  const cookieStore = await cookies()
  const cart = await getCart()
  
  const filteredCart = cart.filter(
    item => !(
      item.product.id === productId && 
      item.size === size && 
      item.color === color
    )
  )
  
  cookieStore.set(CART_COOKIE_NAME, JSON.stringify(filteredCart), {
    maxAge: 60 * 60 * 24 * CART_EXPIRY_DAYS,
    path: '/',
  })
}

export async function clearCart(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(CART_COOKIE_NAME)
}

export async function getCartTotal(): Promise<{
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  itemCount: number;
}> {
  const cart = await getCart()
  
  const subtotal = cart.reduce((sum, item) => {
    const price = item.product.metadata.sale_price || item.product.metadata.price
    return sum + (price * item.quantity)
  }, 0)
  
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0)
  
  // Calculate shipping (free over $150)
  const shipping = subtotal >= 150 ? 0 : 10
  
  // Calculate tax (8.5%)
  const tax = subtotal * 0.085
  
  const total = subtotal + shipping + tax
  
  return {
    subtotal,
    shipping,
    tax,
    total,
    itemCount,
  }
}
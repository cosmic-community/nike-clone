import { Cart, CartItem } from '@/types'

const CART_STORAGE_KEY = 'nike-clone-cart'

export function getCart(): Cart {
  if (typeof window === 'undefined') {
    return { items: [], updatedAt: new Date().toISOString() }
  }
  
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored) as Cart
    }
  } catch (error) {
    console.error('Failed to parse cart from storage:', error)
  }
  
  return { items: [], updatedAt: new Date().toISOString() }
}

export function saveCart(cart: Cart): void {
  if (typeof window === 'undefined') return
  
  try {
    cart.updatedAt = new Date().toISOString()
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart))
  } catch (error) {
    console.error('Failed to save cart to storage:', error)
  }
}

export function addToCart(item: CartItem): Cart {
  const cart = getCart()
  
  // Check if item with same product, size, and color exists
  const existingIndex = cart.items.findIndex(
    (i) => 
      i.productId === item.productId && 
      i.size === item.size && 
      i.color === item.color
  )
  
  if (existingIndex > -1) {
    // Update quantity
    cart.items[existingIndex].quantity += item.quantity
  } else {
    // Add new item
    cart.items.push(item)
  }
  
  saveCart(cart)
  return cart
}

export function updateCartItemQuantity(
  productId: string, 
  size: string, 
  color: string, 
  quantity: number
): Cart {
  const cart = getCart()
  
  const itemIndex = cart.items.findIndex(
    (i) => 
      i.productId === productId && 
      i.size === size && 
      i.color === color
  )
  
  if (itemIndex > -1) {
    if (quantity <= 0) {
      cart.items.splice(itemIndex, 1)
    } else {
      cart.items[itemIndex].quantity = quantity
    }
    saveCart(cart)
  }
  
  return cart
}

export function removeFromCart(productId: string, size: string, color: string): Cart {
  const cart = getCart()
  
  cart.items = cart.items.filter(
    (i) => 
      !(i.productId === productId && i.size === size && i.color === color)
  )
  
  saveCart(cart)
  return cart
}

export function clearCart(): Cart {
  const cart: Cart = { items: [], updatedAt: new Date().toISOString() }
  saveCart(cart)
  return cart
}

export function getCartTotal(cart: Cart): { subtotal: number; itemCount: number } {
  let subtotal = 0
  let itemCount = 0
  
  for (const item of cart.items) {
    const price = item.salePrice ?? item.price
    subtotal += price * item.quantity
    itemCount += item.quantity
  }
  
  return { subtotal, itemCount }
}

export function calculateTax(subtotal: number): number {
  // 8.5% tax rate
  return Math.round(subtotal * 0.085 * 100) / 100
}

export function calculateShipping(subtotal: number): number {
  // Free shipping over $100, otherwise $10
  return subtotal >= 100 ? 0 : 10
}
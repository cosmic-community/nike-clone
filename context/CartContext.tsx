'use client'

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import { Cart, CartItem } from '@/types'
import { 
  getCart, 
  addToCart as addToCartStorage, 
  updateCartItemQuantity as updateQuantityStorage,
  removeFromCart as removeFromCartStorage,
  clearCart as clearCartStorage,
  getCartTotal
} from '@/lib/cart'

interface CartContextType {
  cart: Cart
  itemCount: number
  subtotal: number
  isCartOpen: boolean
  openCart: () => void
  closeCart: () => void
  toggleCart: () => void
  addToCart: (item: CartItem) => void
  updateQuantity: (productId: string, size: string, color: string, quantity: number) => void
  removeFromCart: (productId: string, size: string, color: string) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart>({ items: [], updatedAt: '' })
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isHydrated, setIsHydrated] = useState(false)

  // Load cart from localStorage on mount
  useEffect(() => {
    setCart(getCart())
    setIsHydrated(true)
  }, [])

  const { subtotal, itemCount } = getCartTotal(cart)

  const openCart = useCallback(() => setIsCartOpen(true), [])
  const closeCart = useCallback(() => setIsCartOpen(false), [])
  const toggleCart = useCallback(() => setIsCartOpen((prev) => !prev), [])

  const addToCart = useCallback((item: CartItem) => {
    const updatedCart = addToCartStorage(item)
    setCart(updatedCart)
    setIsCartOpen(true) // Open cart drawer when item is added
  }, [])

  const updateQuantity = useCallback(
    (productId: string, size: string, color: string, quantity: number) => {
      const updatedCart = updateQuantityStorage(productId, size, color, quantity)
      setCart(updatedCart)
    },
    []
  )

  const removeFromCart = useCallback(
    (productId: string, size: string, color: string) => {
      const updatedCart = removeFromCartStorage(productId, size, color)
      setCart(updatedCart)
    },
    []
  )

  const clearCartHandler = useCallback(() => {
    const updatedCart = clearCartStorage()
    setCart(updatedCart)
  }, [])

  // Don't render cart count until hydrated to avoid hydration mismatch
  const displayItemCount = isHydrated ? itemCount : 0

  return (
    <CartContext.Provider
      value={{
        cart,
        itemCount: displayItemCount,
        subtotal,
        isCartOpen,
        openCart,
        closeCart,
        toggleCart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart: clearCartHandler,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
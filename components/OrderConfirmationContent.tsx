'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useCart } from '@/context/CartContext'

interface OrderDetails {
  id: string
  email: string
  total: number
  items: Array<{
    name: string
    quantity: number
    price: number
    size: string
    color: string
  }>
}

export default function OrderConfirmationContent() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const { clearCart } = useCart()
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (sessionId) {
      // Clear the cart after successful payment
      clearCart()

      // Fetch order details
      fetch(`/api/order-confirmation?session_id=${sessionId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            setError(data.error)
          } else {
            setOrderDetails(data)
          }
        })
        .catch(() => {
          setError('Failed to load order details')
        })
        .finally(() => {
          setIsLoading(false)
        })
    } else {
      setIsLoading(false)
      setError('No order session found')
    }
  }, [sessionId, clearCart])

  if (isLoading) {
    return (
      <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto text-center">
        <div className="animate-spin h-12 w-12 border-4 border-nike-black border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-gray-500">Loading your order details...</p>
      </div>
    )
  }

  if (error || !orderDetails) {
    return (
      <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto text-center">
        <svg className="w-16 h-16 mx-auto text-yellow-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <h1 className="text-2xl font-bold mb-2">Something went wrong</h1>
        <p className="text-gray-500 mb-6">{error || 'We couldn\'t find your order details.'}</p>
        <Link href="/products" className="btn-primary px-8 py-3 inline-block">
          Continue Shopping
        </Link>
      </div>
    )
  }

  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
      <div className="text-center mb-12">
        <svg className="w-20 h-20 mx-auto text-green-500 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h1 className="text-3xl font-bold mb-2">Thank you for your order!</h1>
        <p className="text-gray-500">
          We&apos;ve sent a confirmation email to <strong>{orderDetails.email}</strong>
        </p>
      </div>

      <div className="bg-gray-50 rounded-lg p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Order Summary</h2>
          <span className="text-sm text-gray-500">Order #{orderDetails.id.slice(-8).toUpperCase()}</span>
        </div>

        <div className="divide-y">
          {orderDetails.items.map((item, index) => (
            <div key={index} className="py-4 flex justify-between">
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-gray-500">
                  {item.color} / Size {item.size} × {item.quantity}
                </p>
              </div>
              <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
            </div>
          ))}
        </div>

        <div className="border-t pt-4 mt-4">
          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>${orderDetails.total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="text-center space-y-4">
        <Link href="/products" className="btn-primary px-8 py-3 inline-block">
          Continue Shopping
        </Link>
        <p className="text-sm text-gray-500">
          Have questions? Contact us at <a href="mailto:support@nikeclone.com" className="underline">support@nikeclone.com</a>
        </p>
      </div>
    </div>
  )
}
'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'

export default function CheckoutForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    
    const formData = new FormData(e.currentTarget)
    const customerEmail = formData.get('email') as string
    const customerName = `${formData.get('firstName')} ${formData.get('lastName')}`
    const shippingAddress = `${formData.get('address')}, ${formData.get('city')}, ${formData.get('state')} ${formData.get('zip')}, ${formData.get('country')}`
    
    try {
      const response = await fetch('/api/checkout/create-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerEmail,
          customerName,
          shippingAddress,
        }),
      })
      
      if (!response.ok) {
        throw new Error('Failed to create checkout session')
      }
      
      const { url } = await response.json()
      
      // Redirect to Stripe Checkout
      window.location.href = url
    } catch (err) {
      setError('Failed to proceed to checkout. Please try again.')
      setIsLoading(false)
    }
  }
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-bold mb-4">Contact Information</h2>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-nike-black focus:border-transparent"
            />
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-bold mb-4">Shipping Address</h2>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium mb-1">
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                required
                className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-nike-black focus:border-transparent"
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium mb-1">
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                required
                className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-nike-black focus:border-transparent"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="address" className="block text-sm font-medium mb-1">
              Address
            </label>
            <input
              type="text"
              id="address"
              name="address"
              required
              className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-nike-black focus:border-transparent"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="city" className="block text-sm font-medium mb-1">
                City
              </label>
              <input
                type="text"
                id="city"
                name="city"
                required
                className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-nike-black focus:border-transparent"
              />
            </div>
            <div>
              <label htmlFor="state" className="block text-sm font-medium mb-1">
                State / Province
              </label>
              <input
                type="text"
                id="state"
                name="state"
                required
                className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-nike-black focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="zip" className="block text-sm font-medium mb-1">
                ZIP / Postal Code
              </label>
              <input
                type="text"
                id="zip"
                name="zip"
                required
                className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-nike-black focus:border-transparent"
              />
            </div>
            <div>
              <label htmlFor="country" className="block text-sm font-medium mb-1">
                Country
              </label>
              <input
                type="text"
                id="country"
                name="country"
                required
                defaultValue="United States"
                className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-nike-black focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4">
          {error}
        </div>
      )}
      
      <button
        type="submit"
        disabled={isLoading}
        className="w-full btn-primary py-4 text-lg disabled:opacity-50"
      >
        {isLoading ? 'Processing...' : 'Continue to Payment'}
      </button>
    </form>
  )
}
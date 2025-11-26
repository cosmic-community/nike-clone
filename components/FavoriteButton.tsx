'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface FavoriteButtonProps {
  productId: string
  initialIsFavorited: boolean
  isAuthenticated: boolean
}

export default function FavoriteButton({ productId, initialIsFavorited, isAuthenticated }: FavoriteButtonProps) {
  const router = useRouter()
  const [isFavorited, setIsFavorited] = useState(initialIsFavorited)
  const [isLoading, setIsLoading] = useState(false)

  const handleToggleFavorite = async () => {
    if (!isAuthenticated) {
      // Redirect to login if not authenticated
      router.push('/login?redirect=/products')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/favorites/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
      })

      if (response.ok) {
        const data = await response.json()
        setIsFavorited(data.isFavorited)
        router.refresh()
      } else {
        alert('Failed to update favorites')
      }
    } catch (error) {
      console.error('Favorite toggle error:', error)
      alert('Failed to update favorites')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={handleToggleFavorite}
      disabled={isLoading}
      className={`p-2 rounded-full transition-colors ${
        isFavorited 
          ? 'bg-red-50 text-red-600 hover:bg-red-100' 
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      } disabled:opacity-50`}
      aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
    >
      <svg 
        className="w-6 h-6" 
        fill={isFavorited ? 'currentColor' : 'none'} 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
        />
      </svg>
    </button>
  )
}
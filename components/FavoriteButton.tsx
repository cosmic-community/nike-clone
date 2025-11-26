'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Heart } from 'lucide-react'

interface FavoriteButtonProps {
  productId: string
  initialIsFavorite: boolean
}

export default function FavoriteButton({ productId, initialIsFavorite }: FavoriteButtonProps) {
  const router = useRouter()
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite)
  const [isLoading, setIsLoading] = useState(false)

  const handleToggleFavorite = async () => {
    setIsLoading(true)

    try {
      const response = await fetch('/api/favorites/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
      })

      const data = await response.json()

      if (!response.ok) {
        if (response.status === 401) {
          // User not logged in, redirect to login
          router.push('/login')
          return
        }
        throw new Error(data.error || 'Failed to update favorites')
      }

      setIsFavorite(data.isFavorite)
      router.refresh()
    } catch (error) {
      console.error('Error toggling favorite:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={handleToggleFavorite}
      disabled={isLoading}
      className="flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-full hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
    >
      <Heart
        className={`w-5 h-5 transition-colors ${
          isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'
        }`}
      />
      <span className="font-medium">
        {isFavorite ? 'Saved' : 'Save to Favorites'}
      </span>
    </button>
  )
}
'use client'

import { useRouter } from 'next/navigation'
import { AuthUser } from '@/types'

interface ProfileHeaderProps {
  user: AuthUser
}

export default function ProfileHeader({ user }: ProfileHeaderProps) {
  const router = useRouter()
  
  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      router.push('/login')
      router.refresh()
    } catch (error) {
      console.error('Logout error:', error)
    }
  }
  
  return (
    <div className="bg-white rounded-lg shadow-md p-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">{user.name}</h1>
          <p className="text-gray-600">{user.email}</p>
        </div>
        
        <button
          onClick={handleLogout}
          className="px-6 py-2 border border-gray-300 rounded-full hover:bg-gray-50 transition-colors"
        >
          Sign Out
        </button>
      </div>
      
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-nike-lightgray p-6 rounded-lg">
          <h3 className="font-semibold mb-2">Account Info</h3>
          <p className="text-sm text-gray-600">Manage your profile details</p>
        </div>
        
        <div className="bg-nike-lightgray p-6 rounded-lg">
          <h3 className="font-semibold mb-2">Orders</h3>
          <p className="text-sm text-gray-600">Track your order history</p>
        </div>
        
        <div className="bg-nike-lightgray p-6 rounded-lg">
          <h3 className="font-semibold mb-2">Favorites</h3>
          <p className="text-sm text-gray-600">View saved products</p>
        </div>
      </div>
    </div>
  )
}
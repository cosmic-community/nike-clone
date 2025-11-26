import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { getOrdersByUserEmail, getUserFavoriteProducts } from '@/lib/cosmic'
import ProfileHeader from '@/components/ProfileHeader'
import OrdersList from '@/components/OrdersList'
import ProductGrid from '@/components/ProductGrid'
import { generateSEO } from '@/lib/seo'

export const metadata: Metadata = generateSEO({
  title: 'Profile | Nike Clone',
  description: 'Manage your Nike Clone account and orders',
  path: '/profile',
})

export default async function ProfilePage() {
  const user = await getSession()
  
  if (!user) {
    redirect('/login')
  }
  
  const orders = await getOrdersByUserEmail(user.email)
  const favoriteProducts = await getUserFavoriteProducts(user.id) // Changed: Fetch favorite products
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <ProfileHeader user={user} />
      
      {/* Changed: Added favorites section */}
      {favoriteProducts.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Your Favorites ({favoriteProducts.length})</h2>
          <ProductGrid products={favoriteProducts} />
        </div>
      )}
      
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Your Orders</h2>
        <OrdersList orders={orders} />
      </div>
    </div>
  )
}
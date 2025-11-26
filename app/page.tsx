import { Metadata } from 'next'
import HeroCarousel from '@/components/HeroCarousel'
import ProductGrid from '@/components/ProductGrid'
import CategoryShowcase from '@/components/CategoryShowcase'
import { getFeaturedBanners, getFeaturedProducts, getNewArrivals, getCategories } from '@/lib/cosmic'
import { generateSEO } from '@/lib/seo'

export const metadata: Metadata = generateSEO({
  title: 'Nike Clone | Premium Athletic Footwear & Apparel',
  description: 'Shop the latest collection of premium athletic footwear and apparel. Find your perfect gear with Nike Clone - Just Do It.',
  path: '/',
})

export default async function HomePage() {
  const [banners, featuredProducts, newArrivals, categories] = await Promise.all([
    getFeaturedBanners(),
    getFeaturedProducts(),
    getNewArrivals(),
    getCategories(),
  ])

  return (
    <>
      <HeroCarousel banners={banners} />
      
      {newArrivals.length > 0 && (
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold uppercase tracking-tight mb-8">New Arrivals</h2>
          <ProductGrid products={newArrivals} showSaleBadge={true} />
        </section>
      )}

      <CategoryShowcase categories={categories} />

      {featuredProducts.length > 0 && (
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold uppercase tracking-tight mb-8">Featured</h2>
          <ProductGrid products={featuredProducts} />
        </section>
      )}
    </>
  )
}
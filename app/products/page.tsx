import { Metadata } from 'next'
import ProductGrid from '@/components/ProductGrid'
import ProductFilters from '@/components/ProductFilters'
import { getProducts, getCategories } from '@/lib/cosmic'
import { generateSEO } from '@/lib/seo'

export const metadata: Metadata = generateSEO({
  title: 'All Products | Nike Clone',
  description: 'Browse our complete collection of athletic footwear. Find the perfect shoes for your sport and style.',
  path: '/products',
})

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string; category?: string }>
}) {
  const params = await searchParams
  const [allProducts, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ])

  let filteredProducts = allProducts

  if (params.filter === 'new') {
    filteredProducts = allProducts.filter(p => p.metadata?.new_arrival)
  } else if (params.filter === 'featured') {
    filteredProducts = allProducts.filter(p => p.metadata?.featured)
  }

  if (params.category) {
    filteredProducts = filteredProducts.filter(
      p => p.metadata?.category?.slug === params.category
    )
  }

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold uppercase tracking-tight mb-8">All Products</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="lg:w-64 flex-shrink-0">
          <ProductFilters 
            categories={categories} 
            currentFilter={params.filter}
            currentCategory={params.category}
          />
        </aside>
        
        <div className="flex-1">
          {filteredProducts.length > 0 ? (
            <>
              <p className="text-nike-gray mb-6">{filteredProducts.length} Products</p>
              <ProductGrid products={filteredProducts} />
            </>
          ) : (
            <div className="text-center py-16">
              <p className="text-nike-gray text-lg">No products found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
// app/categories/[slug]/page.tsx
import { notFound } from 'next/navigation'
import ProductGrid from '@/components/ProductGrid'
import { getCategoryBySlug, getProductsByCategory, getCategories } from '@/lib/cosmic'

export async function generateStaticParams() {
  const categories = await getCategories()
  return categories.map((category) => ({
    slug: category.slug,
  }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const category = await getCategoryBySlug(slug)
  
  if (!category) {
    return { title: 'Category Not Found' }
  }

  return {
    title: `${category.metadata.name} | Nike Clone`,
    description: category.metadata.description || `Shop ${category.metadata.name} collection`,
  }
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const category = await getCategoryBySlug(slug)

  if (!category) {
    notFound()
  }

  const products = await getProductsByCategory(category.id)

  return (
    <div>
      {category.metadata.image && (
        <div className="relative h-[300px] sm:h-[400px]">
          <img
            src={`${category.metadata.image.imgix_url}?w=1920&h=800&fit=crop&auto=format,compress`}
            alt={category.metadata.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <div className="text-center text-white">
              <h1 className="text-5xl font-bold uppercase tracking-tight mb-4">
                {category.metadata.name}
              </h1>
              {category.metadata.description && (
                <p className="text-lg max-w-2xl mx-auto">
                  {category.metadata.description}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {!category.metadata.image && (
          <>
            <h1 className="text-4xl font-bold uppercase tracking-tight mb-4">
              {category.metadata.name}
            </h1>
            {category.metadata.description && (
              <p className="text-nike-gray text-lg mb-8 max-w-3xl">
                {category.metadata.description}
              </p>
            )}
          </>
        )}

        {products.length > 0 ? (
          <>
            <p className="text-nike-gray mb-6">{products.length} Products</p>
            <ProductGrid products={products} />
          </>
        ) : (
          <div className="text-center py-16">
            <p className="text-nike-gray text-lg">No products in this category yet.</p>
          </div>
        )}
      </section>
    </div>
  )
}
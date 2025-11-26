// app/products/[slug]/page.tsx
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { cosmic } from '@/lib/cosmic'
import { getSession } from '@/lib/auth'
import ProductGallery from '@/components/ProductGallery'
import AddToCartButton from '@/components/AddToCartButton'
import ColorSelector from '@/components/ColorSelector'
import SizeSelector from '@/components/SizeSelector'
import { generateProductJsonLd } from '@/lib/seo'
import FavoriteButton from '@/components/FavoriteButton'
import type { Product } from '@/types'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  
  try {
    const response = await cosmic.objects.findOne({
      type: 'products',
      slug: slug,
    }).props(['title', 'metadata'])

    const product = response.object as Product

    return {
      title: `${product.title} | Nike Clone`,
      description: product.metadata?.description || `Shop ${product.title} at Nike Clone`,
      openGraph: {
        title: product.title,
        description: product.metadata?.description,
        images: product.metadata?.gallery?.[0]?.imgix_url ? [
          {
            url: `${product.metadata.gallery[0].imgix_url}?w=1200&h=630&fit=crop&auto=format,compress`,
            width: 1200,
            height: 630,
          },
        ] : [],
      },
    }
  } catch (error) {
    return {
      title: 'Product Not Found | Nike Clone',
    }
  }
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  let product: Product

  try {
    const response = await cosmic.objects.findOne({
      type: 'products',
      slug: slug,
    }).props(['id', 'title', 'slug', 'metadata']).depth(1)

    product = response.object as Product
  } catch (error) {
    notFound()
  }

  // Get current user session to check if product is favorited
  const user = await getSession()
  const isFavorite = user?.favorite_products?.includes(product.id) || false

  // Get gallery images (using gallery, not images)
  const gallery = product.metadata?.gallery || []

  return (
    <div className="container mx-auto px-4 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateProductJsonLd(product)),
        }}
      />
      
      <div className="grid md:grid-cols-2 gap-8">
        {/* Product Gallery */}
        <ProductGallery
          images={gallery}
          productName={product.title}
        />

        {/* Product Details */}
        <div className="space-y-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
              {product.metadata?.category && (
                <p className="text-gray-600">
                  {typeof product.metadata.category === 'object' && 'title' in product.metadata.category 
                    ? product.metadata.category.title 
                    : ''}
                </p>
              )}
            </div>
            {/* Pass initialIsFavorite prop */}
            <FavoriteButton productId={product.id} initialIsFavorite={isFavorite} />
          </div>

          <div className="text-2xl font-semibold">
            ${product.metadata?.price}
          </div>

          {product.metadata?.description && (
            <p className="text-gray-700">{product.metadata.description}</p>
          )}

          {/* Color Selector */}
          {product.metadata?.colors && product.metadata.colors.length > 0 && (
            <ColorSelector colors={product.metadata.colors} />
          )}

          {/* Size Selector */}
          {product.metadata?.available_sizes && product.metadata.available_sizes.length > 0 && (
            <SizeSelector sizes={product.metadata.available_sizes} />
          )}

          {/* Add to Cart */}
          <AddToCartButton
            product={product}
            availableSizes={product.metadata?.available_sizes}
            availableColors={product.metadata?.colors}
          />

          {/* Product Details */}
          {product.metadata?.description && (
            <div className="border-t pt-6">
              <h2 className="font-semibold mb-3">Product Details</h2>
              <div className="text-gray-700 space-y-2">
                {product.metadata.description.split('\n').map((line: string, index: number) => (
                  <p key={index}>{line}</p>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
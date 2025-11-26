// app/products/[slug]/page.tsx
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getProductBySlug } from '@/lib/cosmic'
import { getSession } from '@/lib/auth'
import ProductGallery from '@/components/ProductGallery'
import AddToCartButton from '@/components/AddToCartButton'
import FavoriteButton from '@/components/FavoriteButton'
import { generateProductSEO } from '@/lib/seo'

interface ProductPageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  
  if (!product) {
    return {
      title: 'Product Not Found | Nike Clone'
    }
  }

  return generateProductSEO(product)
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  const user = await getSession()

  if (!product) {
    notFound()
  }

  // Check if product is in user's favorites
  const isFavorite = user?.favorite_products?.includes(product.id) || false

  const hasDiscount = product.metadata.sale_price && product.metadata.sale_price < product.metadata.price
  const discountPercentage = hasDiscount
    ? Math.round(((product.metadata.price - (product.metadata.sale_price || 0)) / product.metadata.price) * 100)
    : 0

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Gallery */}
        <ProductGallery
          mainImage={product.metadata.main_image}
          gallery={product.metadata.gallery}
          productName={product.metadata.name}
        />

        {/* Product Info */}
        <div className="space-y-6">
          {/* Category */}
          {product.metadata.category && (
            <p className="text-sm text-gray-600 uppercase tracking-wide">
              {product.metadata.category.metadata?.name || product.metadata.category.title}
            </p>
          )}

          {/* Title and Subtitle */}
          <div>
            <h1 className="text-4xl font-bold mb-2">{product.metadata.name}</h1>
            {product.metadata.subtitle && (
              <p className="text-xl text-gray-600">{product.metadata.subtitle}</p>
            )}
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3">
            {hasDiscount ? (
              <>
                <span className="text-3xl font-bold">
                  ${product.metadata.sale_price?.toFixed(2)}
                </span>
                <span className="text-xl text-gray-500 line-through">
                  ${product.metadata.price.toFixed(2)}
                </span>
                <span className="text-sm font-medium text-red-600 bg-red-50 px-2 py-1 rounded">
                  {discountPercentage}% OFF
                </span>
              </>
            ) : (
              <span className="text-3xl font-bold">
                ${product.metadata.price.toFixed(2)}
              </span>
            )}
          </div>

          {/* Description */}
          {product.metadata.description && (
            <div className="prose max-w-none">
              <p className="text-gray-700">{product.metadata.description}</p>
            </div>
          )}

          {/* Colors */}
          {product.metadata.colors && product.metadata.colors.length > 0 && (
            <div>
              <h3 className="text-sm font-medium mb-3">Available Colors</h3>
              <div className="flex gap-2">
                {product.metadata.colors.map((color) => (
                  <div
                    key={color}
                    className="w-8 h-8 rounded-full border-2 border-gray-300"
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Sizes */}
          {product.metadata.available_sizes && product.metadata.available_sizes.length > 0 && (
            <div>
              <h3 className="text-sm font-medium mb-3">Select Size</h3>
              <div className="grid grid-cols-4 gap-2">
                {product.metadata.available_sizes.map((size) => (
                  <button
                    key={size}
                    className="border border-gray-300 rounded-md py-3 text-center hover:border-black transition-colors"
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            <AddToCartButton product={product} />
            <FavoriteButton productId={product.id} initialIsFavorite={isFavorite} />
          </div>

          {/* Product Features */}
          <div className="border-t pt-6 space-y-4">
            <div>
              <h3 className="font-medium mb-2">Free Delivery</h3>
              <p className="text-sm text-gray-600">
                Applies to orders of $150 or more
              </p>
            </div>
            <div>
              <h3 className="font-medium mb-2">Free Returns</h3>
              <p className="text-sm text-gray-600">
                30-day return policy on all orders
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
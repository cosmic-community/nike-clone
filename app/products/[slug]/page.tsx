// app/products/[slug]/page.tsx
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getProductBySlug, getUserById } from '@/lib/cosmic'
import { generateSEO } from '@/lib/seo'
import { getSession } from '@/lib/auth'
import ProductGallery from '@/components/ProductGallery'
import SizeSelector from '@/components/SizeSelector'
import ColorSelector from '@/components/ColorSelector'
import AddToCartButton from '@/components/AddToCartButton'
import FavoriteButton from '@/components/FavoriteButton'
import ProductGrid from '@/components/ProductGrid'

interface ProductPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  
  if (!product) {
    return generateSEO({
      title: 'Product Not Found',
      description: 'The requested product could not be found',
      path: `/products/${slug}`,
    })
  }

  return generateSEO({
    title: `${product.metadata.name} | Nike Clone`,
    description: product.metadata.description || product.metadata.subtitle || `Buy ${product.metadata.name}`,
    path: `/products/${slug}`,
    image: product.metadata.main_image?.imgix_url,
  })
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  
  if (!product) {
    notFound()
  }

  // Get user session and check if product is favorited
  const user = await getSession()
  let isFavorited = false
  
  if (user) {
    const fullUser = await getUserById(user.id)
    if (fullUser && fullUser.metadata.favorite_products) {
      isFavorited = fullUser.metadata.favorite_products.includes(product.id)
    }
  }

  const images = [
    product.metadata.main_image,
    ...(product.metadata.gallery || [])
  ].filter(Boolean)

  const hasDiscount = product.metadata.sale_price && product.metadata.sale_price < product.metadata.price

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Gallery */}
        <div>
          <ProductGallery images={images} productName={product.metadata.name} />
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          {/* Category */}
          {product.metadata.category && (
            <div className="text-sm font-medium text-gray-500 uppercase">
              {product.metadata.category.metadata.name}
            </div>
          )}

          {/* Title and Favorite Button */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-gray-900">
                {product.metadata.name}
              </h1>
              {product.metadata.subtitle && (
                <p className="mt-2 text-lg text-gray-600">
                  {product.metadata.subtitle}
                </p>
              )}
            </div>
            
            {/* Favorite Button */}
            <FavoriteButton
              productId={product.id}
              initialIsFavorited={isFavorited}
              isAuthenticated={!!user}
            />
          </div>

          {/* Price */}
          <div className="flex items-center gap-3">
            <span className={`text-3xl font-bold ${hasDiscount ? 'text-red-600' : 'text-gray-900'}`}>
              ${hasDiscount ? product.metadata.sale_price : product.metadata.price}
            </span>
            {hasDiscount && (
              <span className="text-xl text-gray-500 line-through">
                ${product.metadata.price}
              </span>
            )}
          </div>

          {/* Badges */}
          <div className="flex gap-2">
            {product.metadata.new_arrival && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                New Arrival
              </span>
            )}
            {hasDiscount && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                Sale
              </span>
            )}
          </div>

          {/* Description */}
          {product.metadata.description && (
            <div className="prose prose-sm max-w-none">
              <p className="text-gray-700">{product.metadata.description}</p>
            </div>
          )}

          {/* Size Selector */}
          {product.metadata.available_sizes && product.metadata.available_sizes.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3">
                Select Size
              </h3>
              <SizeSelector sizes={product.metadata.available_sizes} />
            </div>
          )}

          {/* Color Selector */}
          {product.metadata.colors && product.metadata.colors.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3">
                Select Color
              </h3>
              <ColorSelector colors={product.metadata.colors} />
            </div>
          )}

          {/* Add to Cart */}
          <AddToCartButton product={product} />

          {/* Product Details */}
          <div className="border-t pt-6 space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Product Details</h3>
            
            <div className="space-y-2 text-sm text-gray-700">
              <div className="flex justify-between">
                <span className="font-medium">Product ID:</span>
                <span>{product.id.slice(0, 8)}</span>
              </div>
              
              {product.metadata.category && (
                <div className="flex justify-between">
                  <span className="font-medium">Category:</span>
                  <span>{product.metadata.category.metadata.name}</span>
                </div>
              )}
              
              {product.metadata.available_sizes && product.metadata.available_sizes.length > 0 && (
                <div className="flex justify-between">
                  <span className="font-medium">Available Sizes:</span>
                  <span>{product.metadata.available_sizes.join(', ')}</span>
                </div>
              )}
              
              {product.metadata.colors && product.metadata.colors.length > 0 && (
                <div className="flex justify-between">
                  <span className="font-medium">Available Colors:</span>
                  <span>{product.metadata.colors.join(', ')}</span>
                </div>
              )}
            </div>
          </div>

          {/* Shipping & Returns */}
          <div className="border-t pt-6 space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Shipping & Returns</h3>
            <div className="space-y-2 text-sm text-gray-700">
              <p>• Free standard shipping on orders over $50</p>
              <p>• Express shipping available at checkout</p>
              <p>• 30-day free returns on all orders</p>
              <p>• Easy returns with prepaid shipping label</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
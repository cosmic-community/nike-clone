// app/products/[slug]/page.tsx
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import ProductGallery from '@/components/ProductGallery'
import AddToCartButton from '@/components/AddToCartButton'
import { getProductBySlug, getProducts } from '@/lib/cosmic'
import { generateSEO, generateProductJsonLd, generateBreadcrumbJsonLd } from '@/lib/seo'

export async function generateStaticParams() {
  const products = await getProducts()
  return products.map((product) => ({
    slug: product.slug,
  }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  
  if (!product) {
    return { title: 'Product Not Found' }
  }

  const hasDiscount = product.metadata.sale_price && product.metadata.sale_price < product.metadata.price
  const price = hasDiscount ? product.metadata.sale_price : product.metadata.price

  const breadcrumbItems = [
    { name: 'Home', url: '/' },
    { name: 'Products', url: '/products' },
  ]
  
  if (product.metadata.category) {
    breadcrumbItems.push({
      name: product.metadata.category.metadata?.name || product.metadata.category.title,
      url: `/categories/${product.metadata.category.slug}`,
    })
  }
  
  breadcrumbItems.push({
    name: product.metadata.name,
    url: `/products/${product.slug}`,
  })

  const productJsonLd = generateProductJsonLd(product)
  const breadcrumbJsonLd = generateBreadcrumbJsonLd(breadcrumbItems)

  return generateSEO({
    title: `${product.metadata.name} - $${price} | Nike Clone`,
    description: product.metadata.description || product.metadata.subtitle || `Shop ${product.metadata.name} - Premium athletic footwear.`,
    path: `/products/${product.slug}`,
    image: `${product.metadata.main_image.imgix_url}?w=1200&h=630&fit=crop&auto=format,compress`,
    type: 'website',
    jsonLd: {
      ...productJsonLd,
      breadcrumb: breadcrumbJsonLd,
    },
  })
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = await getProductBySlug(slug)

  if (!product) {
    notFound()
  }

  const { metadata } = product
  const images = [metadata.main_image, ...(metadata.gallery || [])]
  const hasDiscount = metadata.sale_price && metadata.sale_price < metadata.price

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <nav className="mb-8">
        <ol className="flex items-center gap-2 text-sm text-nike-gray">
          <li><Link href="/" className="hover:text-nike-black">Home</Link></li>
          <li>/</li>
          <li><Link href="/products" className="hover:text-nike-black">Products</Link></li>
          {metadata.category && (
            <>
              <li>/</li>
              <li>
                <Link 
                  href={`/categories/${metadata.category.slug}`} 
                  className="hover:text-nike-black"
                >
                  {metadata.category.metadata?.name || metadata.category.title}
                </Link>
              </li>
            </>
          )}
          <li>/</li>
          <li className="text-nike-black">{metadata.name}</li>
        </ol>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <ProductGallery images={images} productName={metadata.name} />

        <div className="lg:pl-8">
          {metadata.new_arrival && (
            <span className="inline-block bg-nike-orange text-white text-xs font-bold uppercase px-3 py-1 rounded-full mb-4">
              New
            </span>
          )}
          
          <h1 className="text-3xl font-bold mb-2">{metadata.name}</h1>
          
          {metadata.subtitle && (
            <p className="text-nike-gray text-lg mb-4">{metadata.subtitle}</p>
          )}

          <div className="flex items-center gap-4 mb-8">
            {hasDiscount ? (
              <>
                <span className="text-2xl font-bold text-red-600">
                  ${metadata.sale_price}
                </span>
                <span className="text-xl text-nike-gray line-through">
                  ${metadata.price}
                </span>
              </>
            ) : (
              <span className="text-2xl font-bold">${metadata.price}</span>
            )}
          </div>

          <AddToCartButton 
            product={product}
            availableSizes={metadata.available_sizes}
            availableColors={metadata.colors}
          />

          {metadata.description && (
            <div className="border-t border-gray-200 pt-8 mt-8">
              <h3 className="font-bold text-lg mb-4">Description</h3>
              <p className="text-nike-gray leading-relaxed">{metadata.description}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
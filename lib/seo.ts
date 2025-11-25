import { Metadata } from 'next'
import { Product, Category } from '@/types'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://nike-clone.example.com'
const siteName = 'Nike Clone'
const siteDescription = 'Premium athletic footwear and apparel. Find your perfect gear with Nike Clone - Just Do It.'

export interface SEOProps {
  title: string
  description: string
  path: string
  image?: string
  type?: 'website' | 'article' | 'product'
  jsonLd?: Record<string, any>
}

export function generateSEO({
  title,
  description,
  path,
  image,
  type = 'website',
  jsonLd,
}: SEOProps): Metadata {
  const url = `${siteUrl}${path}`
  const defaultImage = `${siteUrl}/og-image.jpg`
  const ogImage = image || defaultImage

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: 'en_US',
      type,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
    alternates: {
      canonical: url,
    },
    other: jsonLd ? {
      'script:ld+json': JSON.stringify(jsonLd),
    } : undefined,
  }
}

export function generateProductJsonLd(product: Product): Record<string, any> {
  const hasDiscount = product.metadata.sale_price && product.metadata.sale_price < product.metadata.price
  
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.metadata.name,
    description: product.metadata.description || product.metadata.subtitle || '',
    image: product.metadata.main_image.imgix_url,
    brand: {
      '@type': 'Brand',
      name: 'Nike',
    },
    offers: {
      '@type': 'Offer',
      url: `${siteUrl}/products/${product.slug}`,
      priceCurrency: 'USD',
      price: hasDiscount ? product.metadata.sale_price : product.metadata.price,
      availability: 'https://schema.org/InStock',
      priceValidUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    },
    ...(product.metadata.category && {
      category: product.metadata.category.metadata?.name || product.metadata.category.title,
    }),
  }
}

export function generateCategoryJsonLd(category: Category, productsCount: number): Record<string, any> {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: category.metadata.name,
    description: category.metadata.description || `Shop ${category.metadata.name} collection`,
    url: `${siteUrl}/categories/${category.slug}`,
    numberOfItems: productsCount,
  }
}

export function generateWebsiteJsonLd(): Record<string, any> {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteName,
    description: siteDescription,
    url: siteUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteUrl}/products?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }
}

export function generateOrganizationJsonLd(): Record<string, any> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteName,
    description: siteDescription,
    url: siteUrl,
    logo: `${siteUrl}/logo.png`,
    sameAs: [
      'https://twitter.com/nike',
      'https://facebook.com/nike',
      'https://instagram.com/nike',
    ],
  }
}

export function generateBreadcrumbJsonLd(items: Array<{ name: string; url: string }>): Record<string, any> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${siteUrl}${item.url}`,
    })),
  }
}
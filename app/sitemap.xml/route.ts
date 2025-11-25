import { NextResponse } from 'next/server'
import { getProducts, getCategories } from '@/lib/cosmic'

export const dynamic = 'force-dynamic'

export async function GET() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://nike-clone.example.com'
  
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ])

  const staticPages = [
    {
      url: siteUrl,
      lastModified: new Date().toISOString(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${siteUrl}/products`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
  ]

  const productPages = products.map((product) => ({
    url: `${siteUrl}/products/${product.slug}`,
    lastModified: product.modified_at || product.created_at,
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  const categoryPages = categories.map((category) => ({
    url: `${siteUrl}/categories/${category.slug}`,
    lastModified: category.modified_at || category.created_at,
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  const allPages = [...staticPages, ...productPages, ...categoryPages]

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages
  .map(
    (page) => `  <url>
    <loc>${page.url}</loc>
    <lastmod>${page.lastModified}</lastmod>
    <changefreq>${page.changeFrequency}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`

  return new NextResponse(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
import { NextResponse } from 'next/server'

export async function GET() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://nike-clone.example.com'
  
  const robotsTxt = `# *
User-agent: *
Allow: /

# Disallow admin and API routes
User-agent: *
Disallow: /api/

# Sitemap
Sitemap: ${siteUrl}/sitemap.xml
`

  return new NextResponse(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
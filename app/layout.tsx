import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CosmicBadge from '@/components/CosmicBadge'
import ScrollToTop from '@/components/ScrollToTop'
import { CartProvider } from '@/context/CartContext'
import { generateSEO, generateWebsiteJsonLd, generateOrganizationJsonLd } from '@/lib/seo'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = generateSEO({
  title: 'Nike Clone | Just Do It',
  description: 'Premium athletic footwear and apparel. Find your perfect gear with Nike Clone.',
  path: '/',
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const bucketSlug = process.env.COSMIC_BUCKET_SLUG as string
  const websiteJsonLd = generateWebsiteJsonLd()
  const organizationJsonLd = generateOrganizationJsonLd()

  return (
    <html lang="en">
      <head>
        <script src="/dashboard-console-capture.js" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <link
          rel="icon"
          href={
            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0%200%2064%2064'%3E%3Ctext y='.9em' font-size='64'%3E👟%3C/text%3E%3C/svg%3E"
          }
        />
      </head>
      <body className={inter.className}>
        <CartProvider>
          <ScrollToTop />
          <Header />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
          <CosmicBadge bucketSlug={bucketSlug} />
        </CartProvider>
      </body>
    </html>
  )
}
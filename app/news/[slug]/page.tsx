// app/news/[slug]/page.tsx
import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getArticleBySlug, getArticles } from '@/lib/cosmic'
import { generateSEO } from '@/lib/seo'

interface ArticlePageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params
  const article = await getArticleBySlug(slug)

  if (!article) {
    return {
      title: 'Article Not Found',
    }
  }

  return generateSEO({
    title: `${article.metadata.title} | Nike Clone News`,
    description: article.metadata.excerpt || article.metadata.content.substring(0, 160),
    path: `/news/${slug}`,
    image: article.metadata.featured_image.imgix_url,
  })
}

export async function generateStaticParams() {
  const articles = await getArticles()
  return articles.map((article) => ({
    slug: article.slug,
  }))
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params
  const article = await getArticleBySlug(slug)

  if (!article) {
    notFound()
  }

  const { metadata } = article

  return (
    <article className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="py-4 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <nav className="flex items-center gap-2 text-sm text-nike-gray">
          <Link href="/" className="hover:text-nike-black">Home</Link>
          <span>/</span>
          <Link href="/news" className="hover:text-nike-black">News</Link>
          <span>/</span>
          <span className="text-nike-black">{metadata.title}</span>
        </nav>
      </div>

      {/* Hero Image */}
      <div className="relative w-full aspect-[21/9] overflow-hidden bg-nike-lightgray">
        <img
          src={`${metadata.featured_image.imgix_url}?w=2400&h=1028&fit=crop&auto=format,compress`}
          alt={metadata.title}
          className="w-full h-full object-cover"
          width={1200}
          height={514}
        />
      </div>

      {/* Article Content */}
      <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        {/* Category */}
        {metadata.category && (
          <p className="text-sm font-bold uppercase text-nike-gray mb-4">
            {metadata.category}
          </p>
        )}

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold uppercase tracking-tight mb-6">
          {metadata.title}
        </h1>

        {/* Meta Info */}
        <div className="flex items-center gap-4 text-sm text-nike-gray mb-12 pb-8 border-b border-nike-lightgray">
          {metadata.author && (
            <span className="font-medium">By {metadata.author}</span>
          )}
          <span>
            {new Date(metadata.published_date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </span>
        </div>

        {/* Excerpt */}
        {metadata.excerpt && (
          <div className="text-xl text-nike-gray leading-relaxed mb-8">
            {metadata.excerpt}
          </div>
        )}

        {/* Content */}
        <div 
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: metadata.content }}
        />

        {/* Back to News */}
        <div className="mt-16 pt-8 border-t border-nike-lightgray">
          <Link
            href="/news"
            className="inline-flex items-center gap-2 text-nike-black hover:text-nike-gray transition-colors font-medium"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to News
          </Link>
        </div>
      </div>
    </article>
  )
}
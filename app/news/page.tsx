import { Metadata } from 'next'
import Link from 'next/link'
import { getArticles, getFeaturedArticles } from '@/lib/cosmic'
import { generateSEO } from '@/lib/seo'

export const metadata: Metadata = generateSEO({
  title: 'News & Stories | Nike Clone',
  description: 'Stay updated with the latest news, stories, and insights from the world of sports and athletic innovation.',
  path: '/news',
})

export default async function NewsPage() {
  const [featuredArticles, allArticles] = await Promise.all([
    getFeaturedArticles(),
    getArticles(),
  ])

  const regularArticles = allArticles.filter(
    article => !article.metadata.featured
  )

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <h1 className="text-5xl font-bold uppercase tracking-tight mb-4">
          News & Stories
        </h1>
        <p className="text-xl text-nike-gray max-w-2xl">
          Stay updated with the latest news, stories, and insights from the world of sports and athletic innovation.
        </p>
      </section>

      {/* Featured Articles */}
      {featuredArticles.length > 0 && (
        <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold uppercase tracking-tight mb-8">Featured Stories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {featuredArticles.map((article) => (
              <Link
                key={article.id}
                href={`/news/${article.slug}`}
                className="group"
              >
                <div className="relative aspect-[16/9] overflow-hidden bg-nike-lightgray mb-4">
                  <img
                    src={`${article.metadata.featured_image.imgix_url}?w=1600&h=900&fit=crop&auto=format,compress`}
                    alt={article.metadata.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    width={800}
                    height={450}
                  />
                  <div className="absolute top-4 left-4 bg-nike-black text-white text-xs font-bold uppercase px-3 py-1">
                    Featured
                  </div>
                </div>
                <div className="space-y-2">
                  {article.metadata.category && (
                    <p className="text-xs font-bold uppercase text-nike-gray">
                      {article.metadata.category}
                    </p>
                  )}
                  <h3 className="text-2xl font-bold group-hover:text-nike-gray transition-colors">
                    {article.metadata.title}
                  </h3>
                  {article.metadata.excerpt && (
                    <p className="text-nike-gray line-clamp-3">
                      {article.metadata.excerpt}
                    </p>
                  )}
                  <div className="flex items-center gap-4 text-sm text-nike-gray">
                    {article.metadata.author && (
                      <span>{article.metadata.author}</span>
                    )}
                    <span>
                      {new Date(article.metadata.published_date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* All Articles */}
      {regularArticles.length > 0 && (
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold uppercase tracking-tight mb-8">Latest News</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {regularArticles.map((article) => (
              <Link
                key={article.id}
                href={`/news/${article.slug}`}
                className="group"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-nike-lightgray mb-4">
                  <img
                    src={`${article.metadata.featured_image.imgix_url}?w=1200&h=900&fit=crop&auto=format,compress`}
                    alt={article.metadata.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    width={400}
                    height={300}
                  />
                </div>
                <div className="space-y-2">
                  {article.metadata.category && (
                    <p className="text-xs font-bold uppercase text-nike-gray">
                      {article.metadata.category}
                    </p>
                  )}
                  <h3 className="text-xl font-bold group-hover:text-nike-gray transition-colors">
                    {article.metadata.title}
                  </h3>
                  {article.metadata.excerpt && (
                    <p className="text-nike-gray text-sm line-clamp-2">
                      {article.metadata.excerpt}
                    </p>
                  )}
                  <div className="flex items-center gap-3 text-xs text-nike-gray">
                    {article.metadata.author && (
                      <span>{article.metadata.author}</span>
                    )}
                    <span>
                      {new Date(article.metadata.published_date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Empty State */}
      {allArticles.length === 0 && (
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center">
            <p className="text-nike-gray text-lg">No articles available yet. Check back soon!</p>
          </div>
        </section>
      )}
    </div>
  )
}
import Link from 'next/link'
import { Category } from '@/types'

interface CategoryShowcaseProps {
  categories: Category[]
}

export default function CategoryShowcase({ categories }: CategoryShowcaseProps) {
  if (categories.length === 0) {
    return null
  }

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold uppercase tracking-tight mb-8">Shop By Category</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/categories/${category.slug}`}
            className="group relative aspect-square overflow-hidden bg-nike-lightgray"
          >
            {category.metadata.image ? (
              <img
                src={`${category.metadata.image.imgix_url}?w=600&h=600&fit=crop&auto=format,compress`}
                alt={category.metadata.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                width={300}
                height={300}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300" />
            )}
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
              <h3 className="text-2xl font-bold uppercase tracking-tight">
                {category.metadata.name}
              </h3>
              <span className="mt-2 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                Shop Now →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
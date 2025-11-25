'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Category } from '@/types'

interface ProductFiltersProps {
  categories: Category[]
  currentFilter?: string
  currentCategory?: string
}

export default function ProductFilters({ categories, currentFilter, currentCategory }: ProductFiltersProps) {
  const pathname = usePathname()

  const filters = [
    { key: 'all', label: 'All Products', href: '/products' },
    { key: 'new', label: 'New Arrivals', href: '/products?filter=new' },
    { key: 'featured', label: 'Featured', href: '/products?filter=featured' },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h3 className="font-bold uppercase text-sm mb-4">Filter By</h3>
        <ul className="space-y-2">
          {filters.map((filter) => (
            <li key={filter.key}>
              <Link
                href={filter.href}
                className={`block py-1 transition-colors ${
                  (filter.key === 'all' && !currentFilter) || currentFilter === filter.key
                    ? 'text-nike-black font-medium'
                    : 'text-nike-gray hover:text-nike-black'
                }`}
              >
                {filter.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="font-bold uppercase text-sm mb-4">Categories</h3>
        <ul className="space-y-2">
          <li>
            <Link
              href={currentFilter ? `/products?filter=${currentFilter}` : '/products'}
              className={`block py-1 transition-colors ${
                !currentCategory
                  ? 'text-nike-black font-medium'
                  : 'text-nike-gray hover:text-nike-black'
              }`}
            >
              All Categories
            </Link>
          </li>
          {categories.map((category) => {
            const href = currentFilter 
              ? `/products?filter=${currentFilter}&category=${category.slug}`
              : `/products?category=${category.slug}`
            
            return (
              <li key={category.id}>
                <Link
                  href={href}
                  className={`block py-1 transition-colors ${
                    currentCategory === category.slug
                      ? 'text-nike-black font-medium'
                      : 'text-nike-gray hover:text-nike-black'
                  }`}
                >
                  {category.metadata.name}
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import ProductCard from './ProductCard'
import { Product, Category } from '@/types'

interface SearchFilters {
  category: string
  minPrice: string
  maxPrice: string
  color: string
  size: string
}

interface SearchData {
  products: Product[]
  total: number
  categories: Category[]
  query: string
}

const COLORS = ['Black', 'White', 'Red', 'Blue', 'Grey', 'Green', 'Orange', 'Pink']
const SIZES = ['6', '7', '8', '9', '10', '11', '12', '13', 'S', 'M', 'L', 'XL', 'XXL']

export default function SearchResults() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const initialQuery = searchParams.get('q') || ''
  
  const [query, setQuery] = useState(initialQuery)
  const [data, setData] = useState<SearchData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState<SearchFilters>({
    category: searchParams.get('category') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    color: searchParams.get('color') || '',
    size: searchParams.get('size') || '',
  })

  const fetchResults = useCallback(async () => {
    setIsLoading(true)
    const params = new URLSearchParams()
    if (query) params.set('q', query)
    if (filters.category) params.set('category', filters.category)
    if (filters.minPrice) params.set('minPrice', filters.minPrice)
    if (filters.maxPrice) params.set('maxPrice', filters.maxPrice)
    if (filters.color) params.set('color', filters.color)
    if (filters.size) params.set('size', filters.size)

    try {
      const response = await fetch(`/api/search?${params.toString()}`)
      const result = await response.json()
      setData(result)
    } catch (error) {
      console.error('Search error:', error)
    } finally {
      setIsLoading(false)
    }
  }, [query, filters])

  useEffect(() => {
    fetchResults()
  }, [fetchResults])

  useEffect(() => {
    setQuery(initialQuery)
  }, [initialQuery])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (query) params.set('q', query)
    if (filters.category) params.set('category', filters.category)
    if (filters.minPrice) params.set('minPrice', filters.minPrice)
    if (filters.maxPrice) params.set('maxPrice', filters.maxPrice)
    if (filters.color) params.set('color', filters.color)
    if (filters.size) params.set('size', filters.size)
    router.push(`/search?${params.toString()}`)
  }

  const updateFilter = (key: keyof SearchFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const clearFilters = () => {
    setFilters({
      category: '',
      minPrice: '',
      maxPrice: '',
      color: '',
      size: '',
    })
  }

  const hasActiveFilters = Object.values(filters).some(v => v !== '')

  return (
    <div>
      {/* Search Input */}
      <form onSubmit={handleSearch} className="mb-8">
        <div className="relative max-w-2xl">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for products..."
            className="w-full bg-nike-lightgray rounded-full pl-12 pr-4 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-nike-black"
          />
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-nike-gray"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </form>

      {/* Results Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          {query ? (
            <h1 className="text-2xl font-bold">
              {isLoading ? 'Searching...' : `Results for "${query}"`}
            </h1>
          ) : (
            <h1 className="text-2xl font-bold">All Products</h1>
          )}
          {!isLoading && data && (
            <p className="text-nike-gray mt-1">
              {data.total} product{data.total !== 1 ? 's' : ''} found
            </p>
          )}
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-full hover:border-nike-black transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          <span>Filters</span>
          {hasActiveFilters && (
            <span className="w-2 h-2 bg-nike-orange rounded-full" />
          )}
        </button>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-nike-lightgray rounded-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold">Filters</h3>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-sm text-nike-gray hover:text-nike-black underline"
              >
                Clear all
              </button>
            )}
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <select
                value={filters.category}
                onChange={(e) => updateFilter('category', e.target.value)}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nike-black"
              >
                <option value="">All Categories</option>
                {data?.categories?.map((cat) => (
                  <option key={cat.id} value={cat.slug}>
                    {cat.metadata?.name || cat.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium mb-2">Min Price</label>
              <input
                type="number"
                value={filters.minPrice}
                onChange={(e) => updateFilter('minPrice', e.target.value)}
                placeholder="$0"
                min="0"
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nike-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Max Price</label>
              <input
                type="number"
                value={filters.maxPrice}
                onChange={(e) => updateFilter('maxPrice', e.target.value)}
                placeholder="$500"
                min="0"
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nike-black"
              />
            </div>

            {/* Color Filter */}
            <div>
              <label className="block text-sm font-medium mb-2">Color</label>
              <select
                value={filters.color}
                onChange={(e) => updateFilter('color', e.target.value)}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nike-black"
              >
                <option value="">All Colors</option>
                {COLORS.map((color) => (
                  <option key={color} value={color}>
                    {color}
                  </option>
                ))}
              </select>
            </div>

            {/* Size Filter */}
            <div>
              <label className="block text-sm font-medium mb-2">Size</label>
              <select
                value={filters.size}
                onChange={(e) => updateFilter('size', e.target.value)}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nike-black"
              >
                <option value="">All Sizes</option>
                {SIZES.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={fetchResults}
            className="mt-4 px-6 py-2 bg-nike-black text-white rounded-full hover:bg-gray-800 transition-colors"
          >
            Apply Filters
          </button>
        </div>
      )}

      {/* Active Filter Tags */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 mb-6">
          {filters.category && data?.categories && (
            <FilterTag
              label={`Category: ${data.categories.find(c => c.slug === filters.category)?.metadata?.name || filters.category}`}
              onRemove={() => updateFilter('category', '')}
            />
          )}
          {filters.minPrice && (
            <FilterTag
              label={`Min: $${filters.minPrice}`}
              onRemove={() => updateFilter('minPrice', '')}
            />
          )}
          {filters.maxPrice && (
            <FilterTag
              label={`Max: $${filters.maxPrice}`}
              onRemove={() => updateFilter('maxPrice', '')}
            />
          )}
          {filters.color && (
            <FilterTag
              label={`Color: ${filters.color}`}
              onRemove={() => updateFilter('color', '')}
            />
          )}
          {filters.size && (
            <FilterTag
              label={`Size: ${filters.size}`}
              onRemove={() => updateFilter('size', '')}
            />
          )}
        </div>
      )}

      {/* Results Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="animate-pulse space-y-4">
              <div className="aspect-square bg-nike-lightgray rounded-lg" />
              <div className="h-4 bg-nike-lightgray rounded w-3/4" />
              <div className="h-4 bg-nike-lightgray rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : data && data.products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {data.products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <svg
            className="w-16 h-16 mx-auto text-nike-gray mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <h2 className="text-xl font-medium mb-2">No products found</h2>
          <p className="text-nike-gray mb-6">
            {query
              ? `We couldn't find any products matching "${query}"`
              : 'Try adjusting your filters'}
          </p>
          <button
            onClick={() => {
              setQuery('')
              clearFilters()
              router.push('/products')
            }}
            className="px-6 py-3 bg-nike-black text-white rounded-full hover:bg-gray-800 transition-colors"
          >
            Browse All Products
          </button>
        </div>
      )}
    </div>
  )
}

function FilterTag({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1 px-3 py-1 bg-nike-lightgray rounded-full text-sm">
      {label}
      <button
        onClick={onRemove}
        className="w-4 h-4 flex items-center justify-center hover:bg-gray-300 rounded-full transition-colors"
        aria-label={`Remove ${label} filter`}
      >
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </span>
  )
}
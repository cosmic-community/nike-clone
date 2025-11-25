'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Product } from '@/types'

interface SearchResult {
  products: Product[]
  total: number
  query: string
}

export default function SearchBar() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1) // Changed: Added selected index for keyboard navigation
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  // Changed: Calculate visible results count (max 5 products + optional "view all" link)
  const visibleProducts = results?.products?.slice(0, 5) || []
  const hasViewAllLink = results && results.total > 5
  const totalNavigableItems = visibleProducts.length + (hasViewAllLink ? 1 : 0)

  // Debounced search function
  const searchProducts = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults(null)
      setIsOpen(false)
      setSelectedIndex(-1) // Changed: Reset selection when clearing
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`)
      const data = await response.json()
      setResults(data)
      setIsOpen(true)
      setSelectedIndex(-1) // Changed: Reset selection on new search
    } catch (error) {
      console.error('Search error:', error)
      setResults(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Debounce effect
  useEffect(() => {
    const timer = setTimeout(() => {
      searchProducts(query)
    }, 300)

    return () => clearTimeout(timer)
  }, [query, searchProducts])

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setSelectedIndex(-1) // Changed: Reset selection when closing
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Changed: Enhanced keyboard navigation handler
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || !results || results.products.length === 0) {
      // If dropdown is closed but user presses Enter, go to search page
      if (e.key === 'Enter' && query.trim()) {
        setIsOpen(false)
        router.push(`/search?q=${encodeURIComponent(query)}`)
      }
      if (e.key === 'Escape') {
        setIsOpen(false)
        inputRef.current?.blur()
      }
      return
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault() // Prevent cursor from moving in input
        setSelectedIndex(prev => {
          const nextIndex = prev + 1
          return nextIndex >= totalNavigableItems ? 0 : nextIndex
        })
        break
      
      case 'ArrowUp':
        e.preventDefault() // Prevent cursor from moving in input
        setSelectedIndex(prev => {
          const nextIndex = prev - 1
          return nextIndex < 0 ? totalNavigableItems - 1 : nextIndex
        })
        break
      
      case 'Enter':
        e.preventDefault()
        if (selectedIndex === -1) {
          // No item selected, go to search results page
          setIsOpen(false)
          router.push(`/search?q=${encodeURIComponent(query)}`)
        } else if (selectedIndex < visibleProducts.length) {
          // Product item selected
          const selectedProduct = visibleProducts[selectedIndex]
          if (selectedProduct) {
            setIsOpen(false)
            setQuery('')
            router.push(`/products/${selectedProduct.slug}`)
          }
        } else if (hasViewAllLink) {
          // "View all" link selected
          setIsOpen(false)
          setQuery('')
          router.push(`/search?q=${encodeURIComponent(query)}`)
        }
        break
      
      case 'Escape':
        setIsOpen(false)
        setSelectedIndex(-1)
        inputRef.current?.blur()
        break
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      setIsOpen(false)
      setSelectedIndex(-1) // Changed: Reset selection on submit
      router.push(`/search?q=${encodeURIComponent(query)}`)
    }
  }

  // Changed: Reset selection when results change
  useEffect(() => {
    setSelectedIndex(-1)
  }, [results])

  return (
    <div ref={searchRef} className="relative">
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => query && results && setIsOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder="Search"
            className="bg-nike-lightgray rounded-full pl-10 pr-4 py-2 text-sm w-40 focus:w-56 transition-all focus:outline-none focus:ring-2 focus:ring-nike-black"
            role="combobox" // Changed: Added accessibility attributes
            aria-expanded={isOpen}
            aria-controls="search-results-dropdown"
            aria-activedescendant={selectedIndex >= 0 ? `search-result-${selectedIndex}` : undefined}
          />
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-nike-gray"
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
          {isLoading && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <div className="w-4 h-4 border-2 border-nike-gray border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>
      </form>

      {/* Search Results Dropdown */}
      {isOpen && results && (
        <div 
          id="search-results-dropdown" // Changed: Added id for accessibility
          role="listbox" // Changed: Added role for accessibility
          className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden z-50 min-w-[320px]"
        >
          {results.products.length > 0 ? (
            <>
              <div className="p-3 border-b border-gray-100">
                <p className="text-xs text-nike-gray">
                  {results.total} result{results.total !== 1 ? 's' : ''} for "{results.query}"
                </p>
              </div>
              <ul className="max-h-[400px] overflow-y-auto">
                {visibleProducts.map((product, index) => (
                  <li 
                    key={product.id}
                    id={`search-result-${index}`} // Changed: Added id for accessibility
                    role="option" // Changed: Added role for accessibility
                    aria-selected={selectedIndex === index} // Changed: Added aria-selected
                  >
                    <Link
                      href={`/products/${product.slug}`}
                      onClick={() => {
                        setIsOpen(false)
                        setQuery('')
                        setSelectedIndex(-1)
                      }}
                      className={`flex items-center gap-4 p-3 transition-colors ${
                        selectedIndex === index 
                          ? 'bg-nike-lightgray' // Changed: Highlight selected item
                          : 'hover:bg-nike-lightgray'
                      }`}
                    >
                      <div className="w-16 h-16 bg-nike-lightgray rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={`${product.metadata?.main_image?.imgix_url}?w=128&h=128&fit=crop&auto=format,compress`}
                          alt={product.metadata?.name || product.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm text-nike-black truncate">
                          {product.metadata?.name || product.title}
                        </h4>
                        {product.metadata?.subtitle && (
                          <p className="text-xs text-nike-gray truncate">
                            {product.metadata.subtitle}
                          </p>
                        )}
                        <p className="text-sm font-medium mt-1">
                          {product.metadata?.sale_price ? (
                            <>
                              <span className="text-red-600">${product.metadata.sale_price}</span>
                              <span className="text-nike-gray line-through ml-2">
                                ${product.metadata.price}
                              </span>
                            </>
                          ) : (
                            <span>${product.metadata?.price}</span>
                          )}
                        </p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
              {hasViewAllLink && (
                <Link
                  id={`search-result-${visibleProducts.length}`} // Changed: Added id for accessibility
                  role="option" // Changed: Added role for accessibility
                  aria-selected={selectedIndex === visibleProducts.length} // Changed: Added aria-selected
                  href={`/search?q=${encodeURIComponent(query)}`}
                  onClick={() => {
                    setIsOpen(false)
                    setQuery('')
                    setSelectedIndex(-1)
                  }}
                  className={`block p-3 text-center text-sm font-medium text-nike-black transition-colors border-t border-gray-100 ${
                    selectedIndex === visibleProducts.length 
                      ? 'bg-nike-lightgray' // Changed: Highlight selected item
                      : 'hover:bg-nike-lightgray'
                  }`}
                >
                  View all {results.total} results
                </Link>
              )}
            </>
          ) : (
            <div className="p-6 text-center">
              <p className="text-nike-gray">No products found for "{results.query}"</p>
              <Link
                href="/products"
                onClick={() => setIsOpen(false)}
                className="inline-block mt-3 text-sm font-medium text-nike-black underline hover:no-underline"
              >
                Browse all products
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
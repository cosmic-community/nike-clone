'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Category } from '@/types'

interface MobileMenuProps {
  categories: Category[]
}

export default function MobileMenu({ categories }: MobileMenuProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <>
      {/* Mobile menu button */}
      <button
        className="md:hidden p-2 hover:bg-gray-100 rounded-full transition-colors"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        aria-label="Toggle menu"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {isMobileMenuOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>

      {/* Mobile Navigation Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-white">
          <div className="flex justify-end p-4">
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 hover:bg-gray-100 rounded-full"
              aria-label="Close menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <nav className="px-4 py-2">
            <div className="flex flex-col gap-4">
              <Link
                href="/products?filter=new"
                className="font-medium py-3 text-lg border-b border-gray-100"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                New & Featured
              </Link>
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/categories/${category.slug}`}
                  className="font-medium py-3 text-lg border-b border-gray-100"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {category.metadata.name}
                </Link>
              ))}
              <Link
                href="/products"
                className="font-medium py-3 text-lg border-b border-gray-100"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Sale
              </Link>
            </div>
          </nav>
        </div>
      )}
    </>
  )
}
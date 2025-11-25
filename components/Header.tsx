'use client'

import Link from 'next/link'
import { useState } from 'react'
import SearchBar from './SearchBar'
import CartIcon from './CartIcon'
import CartSlideOver from './CartSlideOver'

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <>
      <header className="bg-white sticky top-0 z-30 border-b border-gray-200">
        {/* Top bar */}
        <div className="bg-gray-100 py-2 px-4 text-xs">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-4">
              <span className="font-medium">Nike Clone</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/products" className="hover:underline">Shop</Link>
              <span>|</span>
              <Link href="/cart" className="hover:underline">Bag</Link>
            </div>
          </div>
        </div>

        {/* Main header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0">
              <span className="text-2xl font-bold tracking-tight">NIKE</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <Link href="/products?filter=new" className="font-medium hover:text-gray-600 transition-colors">
                New & Featured
              </Link>
              <Link href="/products" className="font-medium hover:text-gray-600 transition-colors">
                Shop All
              </Link>
              <Link href="/categories/running" className="font-medium hover:text-gray-600 transition-colors">
                Running
              </Link>
              <Link href="/categories/basketball" className="font-medium hover:text-gray-600 transition-colors">
                Basketball
              </Link>
              <Link href="/categories/lifestyle" className="font-medium hover:text-gray-600 transition-colors">
                Lifestyle
              </Link>
            </nav>

            {/* Right side icons */}
            <div className="flex items-center gap-2">
              <SearchBar />
              <CartIcon />

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
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <nav className="md:hidden border-t border-gray-200 py-4 px-4">
            <div className="flex flex-col gap-4">
              <Link
                href="/products?filter=new"
                className="font-medium py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                New & Featured
              </Link>
              <Link
                href="/products"
                className="font-medium py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Shop All
              </Link>
              <Link
                href="/categories/running"
                className="font-medium py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Running
              </Link>
              <Link
                href="/categories/basketball"
                className="font-medium py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Basketball
              </Link>
              <Link
                href="/categories/lifestyle"
                className="font-medium py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Lifestyle
              </Link>
            </div>
          </nav>
        )}
      </header>

      <CartSlideOver />
    </>
  )
}
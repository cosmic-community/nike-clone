import Link from 'next/link'
import CartButton from '@/components/CartButton'

export default function Header() {
  return (
    <header className="sticky top-0 z-30 bg-white">
      {/* Top Bar */}
      <div className="bg-nike-lightgray py-2 px-4 text-center text-xs">
        <span>Free Delivery on orders over $100</span>
      </div>
      
      {/* Main Header */}
      <nav className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0">
              <svg className="h-6 w-16" viewBox="0 0 69 32" fill="currentColor">
                <path d="M68.56 4L18.4 25.36Q12.16 28 7.92 28Q4 28 2.04 26.32Q.08 24.64.08 21.6Q.08 19.76.84 17.76L3.04 18.64Q2.72 19.6 2.72 20.56Q2.72 22.64 4.12 23.68Q5.52 24.72 8.08 24.72Q11.2 24.72 16.16 22.56L68.56 0Z" />
              </svg>
            </Link>
            
            {/* Navigation Links */}
            <div className="hidden md:flex items-center gap-8">
              <Link href="/products?filter=new" className="text-sm font-medium hover:text-nike-gray transition-colors">
                New & Featured
              </Link>
              <Link href="/products" className="text-sm font-medium hover:text-nike-gray transition-colors">
                Men
              </Link>
              <Link href="/products" className="text-sm font-medium hover:text-nike-gray transition-colors">
                Women
              </Link>
              <Link href="/products" className="text-sm font-medium hover:text-nike-gray transition-colors">
                Kids
              </Link>
            </div>
            
            {/* Right Section */}
            <div className="flex items-center gap-4">
              {/* Search */}
              <div className="hidden sm:block">
                <div className="relative">
                  <input 
                    type="text"
                    placeholder="Search"
                    className="bg-nike-lightgray rounded-full pl-10 pr-4 py-2 text-sm w-40 focus:w-56 transition-all focus:outline-none"
                  />
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-nike-gray" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
              
              {/* Favorites */}
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
              
              {/* Cart */}
              <CartButton />
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}
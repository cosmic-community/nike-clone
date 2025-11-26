import Link from 'next/link'
import { getCategories } from '@/lib/cosmic'
import { getSession } from '@/lib/auth'
import SearchBar from './SearchBar'

export default async function Header() {
  const categories = await getCategories()
  const user = await getSession()

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="bg-nike-lightgray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex justify-between items-center text-xs">
          <div className="flex items-center gap-4">
            <span className="font-bold">Winning Isn't Comfortable</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/products" className="hover:text-nike-gray">Find a Store</Link>
            <span>|</span>
            <Link href="/products" className="hover:text-nike-gray">Help</Link>
            <span>|</span>
            {user ? (
              <>
                <Link href="/profile" className="hover:text-nike-gray font-medium">
                  {user.name}
                </Link>
              </>
            ) : (
              <>
                <Link href="/signup" className="hover:text-nike-gray">Join Us</Link>
                <span>|</span>
                <Link href="/login" className="hover:text-nike-gray">Sign In</Link>
              </>
            )}
          </div>
        </div>
      </div>

      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex-shrink-0">
            <svg className="h-6 w-16" viewBox="0 0 69 32" fill="none">
              <path 
                d="M68.56 4.01C52.37 10.5 36.28 17.11 20.16 23.61C15.16 25.53 10.14 27.41 5.16 29.38C4.33 29.73 3.57 29.8 2.94 29.43C1.66 28.68 1.86 26.81 2.93 25.4C6.58 20.59 12.88 14.67 20.15 9.92C27.15 5.35 37.06 0.31 47.49 0C50.17 -0.07 52.13 0.39 53.36 1.03C55.24 2.02 54.22 3.72 51.88 4.42C45.05 6.47 36.34 7.51 27.78 10.44C26.16 10.99 24.4 11.75 23.47 12.84C22.7 13.74 22.99 14.45 24.07 14.47C25.58 14.5 27.85 13.74 29.63 13.19C41.57 9.49 55.12 5.76 68.56 4.01Z" 
                fill="currentColor"
              />
            </svg>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link href="/products?filter=new" className="font-medium hover:text-nike-gray transition-colors">
              New & Featured
            </Link>
            {categories.map((category) => (
              <Link 
                key={category.id}
                href={`/categories/${category.slug}`} 
                className="font-medium hover:text-nike-gray transition-colors"
              >
                {category.metadata.name}
              </Link>
            ))}
            <Link href="/products" className="font-medium hover:text-nike-gray transition-colors">
              Sale
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:block">
              <SearchBar />
            </div>
            
            <button className="p-2 hover:bg-nike-lightgray rounded-full transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
            
            <button className="p-2 hover:bg-nike-lightgray rounded-full transition-colors relative">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <span className="absolute -top-1 -right-1 bg-nike-black text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                0
              </span>
            </button>

            {/* Mobile Search Button */}
            <Link 
              href="/search" 
              className="sm:hidden p-2 hover:bg-nike-lightgray rounded-full transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </Link>
          </div>
        </div>
      </nav>
    </header>
  )
}
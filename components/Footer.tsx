import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-nike-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h4 className="font-bold uppercase text-sm mb-4">Find a Store</h4>
            <ul className="space-y-2 text-nike-gray text-sm">
              <li><Link href="/products" className="hover:text-white transition-colors">Become a Member</Link></li>
              <li><Link href="/products" className="hover:text-white transition-colors">Send Us Feedback</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold uppercase text-sm mb-4">Get Help</h4>
            <ul className="space-y-2 text-nike-gray text-sm">
              <li><Link href="/products" className="hover:text-white transition-colors">Order Status</Link></li>
              <li><Link href="/products" className="hover:text-white transition-colors">Delivery</Link></li>
              <li><Link href="/products" className="hover:text-white transition-colors">Returns</Link></li>
              <li><Link href="/products" className="hover:text-white transition-colors">Payment Options</Link></li>
              <li><Link href="/products" className="hover:text-white transition-colors">Contact Us</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold uppercase text-sm mb-4">About Nike</h4>
            <ul className="space-y-2 text-nike-gray text-sm">
              <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/news" className="hover:text-white transition-colors">News</Link></li>
              <li><Link href="/products" className="hover:text-white transition-colors">Careers</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold uppercase text-sm mb-4">Follow Us</h4>
            <div className="flex gap-4">
              <a href="#" className="w-8 h-8 bg-nike-gray rounded-full flex items-center justify-center hover:bg-white transition-colors">
                <span className="sr-only">X (formerly Twitter)</span>
                <svg className="w-4 h-4 text-nike-black" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a href="#" className="w-8 h-8 bg-nike-gray rounded-full flex items-center justify-center hover:bg-white transition-colors">
                <span className="sr-only">Instagram</span>
                <svg className="w-4 h-4 text-nike-black" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                </svg>
              </a>
              <a href="#" className="w-8 h-8 bg-nike-gray rounded-full flex items-center justify-center hover:bg-white transition-colors">
                <span className="sr-only">YouTube</span>
                <svg className="w-4 h-4 text-nike-black" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
              <a href="#" className="w-8 h-8 bg-nike-gray rounded-full flex items-center justify-center hover:bg-white transition-colors">
                <span className="sr-only">TikTok</span>
                <svg className="w-4 h-4 text-nike-black" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4 text-nike-gray text-sm">
            <span>© {new Date().getFullYear()} Nike Clone. All Rights Reserved.</span>
            <span className="hidden sm:inline">•</span>
            <a 
              href="https://www.cosmicjs.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-white transition-colors inline-flex items-center gap-1.5"
            >
              Powered by
              <img 
                src="https://cdn.cosmicjs.com/b67de7d0-c810-11ed-b01d-23d7b265c299-logo508x500.svg" 
                alt="Cosmic CMS" 
                className="w-4 h-4 inline-block"
              />
              Cosmic CMS
            </a>
          </div>
          <div className="flex items-center gap-4 text-nike-gray text-sm">
            <Link href="/products" className="hover:text-white transition-colors">Guides</Link>
            <Link href="/products" className="hover:text-white transition-colors">Terms of Sale</Link>
            <Link href="/products" className="hover:text-white transition-colors">Terms of Use</Link>
            <Link href="/products" className="hover:text-white transition-colors">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
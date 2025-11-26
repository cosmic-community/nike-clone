import { Metadata } from 'next'
import { generateSEO } from '@/lib/seo'

export const metadata: Metadata = generateSEO({
  title: 'About Us | Nike Clone',
  description: 'Learn about Nike Clone - your destination for premium athletic footwear and apparel. Powered by Cosmic CMS.',
  path: '/about',
})

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl md:text-5xl font-bold uppercase tracking-tight mb-8">
          About Nike Clone
        </h1>
        
        <div className="prose prose-lg max-w-none">
          <p className="text-xl text-gray-600 mb-6">
            Welcome to Nike Clone, your premier destination for high-quality athletic footwear and apparel.
          </p>

          <section className="mb-12">
            <h2 className="text-2xl font-bold uppercase tracking-tight mb-4">Our Mission</h2>
            <p className="text-gray-700 mb-4">
              We're dedicated to bringing athletes and sports enthusiasts the best in performance gear. 
              Our mission is to inspire and innovate for every athlete in the world. If you have a body, 
              you're an athlete.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold uppercase tracking-tight mb-4">What We Offer</h2>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <span className="text-nike-orange mr-2">✓</span>
                <span>Premium athletic footwear for running, training, and lifestyle</span>
              </li>
              <li className="flex items-start">
                <span className="text-nike-orange mr-2">✓</span>
                <span>High-performance apparel designed for comfort and style</span>
              </li>
              <li className="flex items-start">
                <span className="text-nike-orange mr-2">✓</span>
                <span>Cutting-edge sports technology and innovation</span>
              </li>
              <li className="flex items-start">
                <span className="text-nike-orange mr-2">✓</span>
                <span>Expert customer service and support</span>
              </li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold uppercase tracking-tight mb-4">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-bold text-lg mb-2">Innovation</h3>
                <p className="text-gray-700">
                  We continuously push the boundaries of what's possible in athletic performance.
                </p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-bold text-lg mb-2">Quality</h3>
                <p className="text-gray-700">
                  Every product meets our rigorous standards for durability and performance.
                </p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-bold text-lg mb-2">Community</h3>
                <p className="text-gray-700">
                  We believe in bringing athletes together and supporting active lifestyles.
                </p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-bold text-lg mb-2">Sustainability</h3>
                <p className="text-gray-700">
                  We're committed to reducing our environmental impact and building a better future.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold uppercase tracking-tight mb-4">Get In Touch</h2>
            <p className="text-gray-700 mb-4">
              Have questions or feedback? We'd love to hear from you. Our customer service team is 
              here to help you find the perfect gear for your athletic journey.
            </p>
          </section>

          <section className="border-t border-gray-200 pt-8 mt-12">
            <div className="flex items-center justify-center gap-3 text-gray-600">
              <span>Powered by</span>
              <a 
                href="https://www.cosmicjs.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-gray-800 hover:text-nike-orange transition-colors font-medium"
              >
                <img 
                  src="https://cdn.cosmicjs.com/b67de7d0-c810-11ed-b01d-23d7b265c299-logo508x500.svg" 
                  alt="Cosmic CMS Logo" 
                  className="w-6 h-6"
                />
                Cosmic CMS
              </a>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
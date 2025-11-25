import { Metadata } from 'next'
import CartPageContent from '@/components/CartPageContent'
import { generateSEO } from '@/lib/seo'

export const metadata: Metadata = generateSEO({
  title: 'Shopping Bag | Nike Clone',
  description: 'Review the items in your shopping bag and proceed to checkout.',
  path: '/cart',
})

export default function CartPage() {
  return <CartPageContent />
}
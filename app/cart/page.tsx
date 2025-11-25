import { Metadata } from 'next'
import CartPageContent from '@/components/CartPageContent'

export const metadata: Metadata = {
  title: 'Shopping Bag | Nike Clone',
  description: 'Review your shopping bag and checkout.',
}

export default function CartPage() {
  return <CartPageContent />
}
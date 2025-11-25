import { Suspense } from 'react'
import SearchResults from '@/components/SearchResults'

export const metadata = {
  title: 'Search Results | Nike Clone',
  description: 'Search our collection of athletic footwear.',
}

export default function SearchPage() {
  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <Suspense fallback={<SearchResultsSkeleton />}>
        <SearchResults />
      </Suspense>
    </div>
  )
}

function SearchResultsSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-10 bg-nike-lightgray rounded-lg w-full max-w-2xl mb-8" />
      <div className="h-8 bg-nike-lightgray rounded w-48 mb-6" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="space-y-4">
            <div className="aspect-square bg-nike-lightgray rounded-lg" />
            <div className="h-4 bg-nike-lightgray rounded w-3/4" />
            <div className="h-4 bg-nike-lightgray rounded w-1/2" />
          </div>
        ))}
      </div>
    </div>
  )
}
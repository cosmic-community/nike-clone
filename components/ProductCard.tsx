import Link from 'next/link'
import { Product } from '@/types'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const { metadata } = product
  const hasDiscount = metadata.sale_price && metadata.sale_price < metadata.price

  return (
    <Link href={`/products/${product.slug}`} className="group">
      <div className="relative aspect-square overflow-hidden bg-nike-lightgray mb-4">
        <img
          src={`${metadata.main_image.imgix_url}?w=800&h=800&fit=crop&auto=format,compress`}
          alt={metadata.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          width={400}
          height={400}
        />
        {metadata.new_arrival && (
          <span className="absolute top-3 left-3 bg-nike-orange text-white text-xs font-bold uppercase px-3 py-1 rounded-full">
            New
          </span>
        )}
        {hasDiscount && (
          <span className="absolute top-3 right-3 bg-red-600 text-white text-xs font-bold uppercase px-3 py-1 rounded-full">
            Sale
          </span>
        )}
      </div>
      
      <div>
        <h3 className="font-medium text-nike-black group-hover:text-nike-gray transition-colors">
          {metadata.name}
        </h3>
        {metadata.subtitle && (
          <p className="text-nike-gray text-sm">{metadata.subtitle}</p>
        )}
        {metadata.colors && metadata.colors.length > 0 && (
          <p className="text-nike-gray text-sm">{metadata.colors.length} Colors</p>
        )}
        <div className="mt-2 flex items-center gap-2">
          {hasDiscount ? (
            <>
              <span className="font-medium text-red-600">${metadata.sale_price}</span>
              <span className="text-nike-gray line-through">${metadata.price}</span>
            </>
          ) : (
            <span className="font-medium">${metadata.price}</span>
          )}
        </div>
      </div>
    </Link>
  )
}
'use client'

import { useState } from 'react'
import { ImageFile } from '@/types'

interface ProductGalleryProps {
  images?: ImageFile[]
  productName: string
}

export default function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0)

  // Handle case where images might be undefined or empty
  if (!images || images.length === 0) {
    return (
      <div className="aspect-square bg-gray-100 flex items-center justify-center">
        <p className="text-gray-400">No images available</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="aspect-square overflow-hidden bg-gray-100">
        <img
          src={`${images[selectedImage].imgix_url}?w=1200&h=1200&fit=crop&auto=format,compress`}
          alt={`${productName} - Image ${selectedImage + 1}`}
          className="w-full h-full object-cover"
          width={600}
          height={600}
        />
      </div>

      {/* Thumbnail Gallery */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`aspect-square overflow-hidden border-2 transition-colors ${
                selectedImage === index
                  ? 'border-black'
                  : 'border-gray-200 hover:border-gray-400'
              }`}
            >
              <img
                src={`${image.imgix_url}?w=400&h=400&fit=crop&auto=format,compress`}
                alt={`${productName} - Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
                width={100}
                height={100}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
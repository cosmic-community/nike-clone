'use client'

import { useState } from 'react'
import type { ImageFile } from '@/types'

export interface ProductGalleryProps {
  images?: ImageFile[]
  productName: string
}

export default function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0)

  if (!images || images.length === 0) {
    return (
      <div className="bg-gray-100 aspect-square flex items-center justify-center">
        <p className="text-gray-400">No image available</p>
      </div>
    )
  }

  // Changed: Added validation for selectedImage
  const currentImage = images[selectedImage]
  if (!currentImage) {
    return (
      <div className="bg-gray-100 aspect-square flex items-center justify-center">
        <p className="text-gray-400">No image available</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="bg-gray-50 rounded-lg overflow-hidden aspect-square">
        <img
          src={`${currentImage.imgix_url}?w=1200&h=1200&fit=crop&auto=format,compress`}
          alt={`${productName} - Image ${selectedImage + 1}`}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Thumbnail Gallery */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-4">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`bg-gray-50 rounded-lg overflow-hidden aspect-square border-2 transition-colors ${
                selectedImage === index ? 'border-black' : 'border-transparent hover:border-gray-300'
              }`}
            >
              <img
                src={`${image.imgix_url}?w=400&h=400&fit=crop&auto=format,compress`}
                alt={`${productName} - Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
'use client'

import { useState } from 'react'
import { ImageFile } from '@/types'

interface ProductGalleryProps {
  images: ImageFile[]
  productName: string
}

export default function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)

  const selectedImage = images[selectedIndex]
  if (!selectedImage) {
    return null
  }

  return (
    <div className="flex flex-col-reverse lg:flex-row gap-4">
      {images.length > 1 && (
        <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-y-auto lg:max-h-[600px]">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedIndex(index)}
              className={`flex-shrink-0 w-20 h-20 bg-nike-lightgray overflow-hidden ${
                index === selectedIndex ? 'ring-2 ring-nike-black' : ''
              }`}
            >
              <img
                src={`${image.imgix_url}?w=160&h=160&fit=crop&auto=format,compress`}
                alt={`${productName} view ${index + 1}`}
                className="w-full h-full object-cover"
                width={80}
                height={80}
              />
            </button>
          ))}
        </div>
      )}
      
      <div className="flex-1 aspect-square bg-nike-lightgray overflow-hidden">
        <img
          src={`${selectedImage.imgix_url}?w=1200&h=1200&fit=crop&auto=format,compress`}
          alt={productName}
          className="w-full h-full object-cover"
          width={600}
          height={600}
        />
      </div>
    </div>
  )
}
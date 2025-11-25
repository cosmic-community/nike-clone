'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { FeaturedBanner } from '@/types'

interface HeroCarouselProps {
  banners: FeaturedBanner[]
}

export default function HeroCarousel({ banners }: HeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % banners.length)
  }, [banners.length])

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length)
  }, [banners.length])

  useEffect(() => {
    if (banners.length <= 1) return
    
    const interval = setInterval(nextSlide, 5000)
    return () => clearInterval(interval)
  }, [banners.length, nextSlide])

  if (banners.length === 0) {
    return (
      <div className="h-[600px] bg-nike-lightgray flex items-center justify-center">
        <p className="text-nike-gray">No banners available</p>
      </div>
    )
  }

  const currentBanner = banners[currentIndex]
  if (!currentBanner) {
    return null
  }

  const textColor = currentBanner.metadata.text_color?.key === 'black' ? 'text-nike-black' : 'text-white'

  return (
    <div className="relative h-[500px] sm:h-[600px] lg:h-[700px] overflow-hidden">
      {banners.map((banner, index) => (
        <div
          key={banner.id}
          className={`absolute inset-0 transition-opacity duration-700 ${
            index === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img
            src={`${banner.metadata.background_image.imgix_url}?w=1920&h=1400&fit=crop&auto=format,compress`}
            alt={banner.metadata.headline}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30" />
        </div>
      ))}

      <div className={`absolute inset-0 flex flex-col items-center justify-center text-center px-4 ${textColor}`}>
        <h1 className="text-5xl sm:text-6xl lg:text-8xl font-bold uppercase tracking-tighter mb-4">
          {currentBanner.metadata.headline}
        </h1>
        {currentBanner.metadata.subheadline && (
          <p className="text-lg sm:text-xl lg:text-2xl mb-8 max-w-2xl">
            {currentBanner.metadata.subheadline}
          </p>
        )}
        {currentBanner.metadata.cta_text && currentBanner.metadata.cta_link && (
          <Link
            href={currentBanner.metadata.cta_link}
            className="btn-primary"
          >
            {currentBanner.metadata.cta_text}
          </Link>
        )}
      </div>

      {banners.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/80 hover:bg-white rounded-full flex items-center justify-center transition-colors"
            aria-label="Previous slide"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/80 hover:bg-white rounded-full flex items-center justify-center transition-colors"
            aria-label="Next slide"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentIndex ? 'bg-white' : 'bg-white/50'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
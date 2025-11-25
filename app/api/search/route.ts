import { NextRequest, NextResponse } from 'next/server'
import { getProducts, getCategories } from '@/lib/cosmic'
import { Product } from '@/types'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get('q')?.toLowerCase() || ''
  const category = searchParams.get('category') || ''
  const minPrice = searchParams.get('minPrice')
  const maxPrice = searchParams.get('maxPrice')
  const color = searchParams.get('color')
  const size = searchParams.get('size')

  try {
    const [products, categories] = await Promise.all([
      getProducts(),
      getCategories()
    ])

    let filteredProducts = products

    // Text search across name, description, and subtitle
    if (query) {
      filteredProducts = filteredProducts.filter((product: Product) => {
        const name = product.metadata?.name?.toLowerCase() || ''
        const description = product.metadata?.description?.toLowerCase() || ''
        const subtitle = product.metadata?.subtitle?.toLowerCase() || ''
        const categoryName = product.metadata?.category?.metadata?.name?.toLowerCase() || ''
        
        return (
          name.includes(query) ||
          description.includes(query) ||
          subtitle.includes(query) ||
          categoryName.includes(query)
        )
      })
    }

    // Category filter
    if (category) {
      filteredProducts = filteredProducts.filter(
        (product: Product) => product.metadata?.category?.slug === category
      )
    }

    // Price range filter
    if (minPrice) {
      const min = parseFloat(minPrice)
      filteredProducts = filteredProducts.filter((product: Product) => {
        const price = product.metadata?.sale_price || product.metadata?.price
        return price >= min
      })
    }

    if (maxPrice) {
      const max = parseFloat(maxPrice)
      filteredProducts = filteredProducts.filter((product: Product) => {
        const price = product.metadata?.sale_price || product.metadata?.price
        return price <= max
      })
    }

    // Color filter
    if (color) {
      filteredProducts = filteredProducts.filter((product: Product) => {
        const colors = product.metadata?.colors || []
        return colors.some((c: string) => c.toLowerCase() === color.toLowerCase())
      })
    }

    // Size filter
    if (size) {
      filteredProducts = filteredProducts.filter((product: Product) => {
        const sizes = product.metadata?.available_sizes || []
        return sizes.includes(size)
      })
    }

    return NextResponse.json({
      products: filteredProducts,
      total: filteredProducts.length,
      categories,
      query
    })
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json(
      { error: 'Failed to search products', products: [], total: 0 },
      { status: 500 }
    )
  }
}
import { createBucketClient } from '@cosmicjs/sdk'
import { FeaturedBanner, Product, Category, Order, OrderItem } from '@/types'

export const cosmic = createBucketClient({
  bucketSlug: process.env.COSMIC_BUCKET_SLUG as string,
  readKey: process.env.COSMIC_READ_KEY as string,
  writeKey: process.env.COSMIC_WRITE_KEY as string,
  apiEnvironment: 'staging',
})

function hasStatus(error: unknown): error is { status: number } {
  return typeof error === 'object' && error !== null && 'status' in error
}

export async function getFeaturedBanners(): Promise<FeaturedBanner[]> {
  try {
    const response = await cosmic.objects
      .find({ type: 'featured-banners' })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1)
    return response.objects as FeaturedBanner[]
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return []
    }
    throw new Error('Failed to fetch featured banners')
  }
}

export async function getProducts(): Promise<Product[]> {
  try {
    const response = await cosmic.objects
      .find({ type: 'products' })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1)
    return response.objects as Product[]
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return []
    }
    throw new Error('Failed to fetch products')
  }
}

export async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const response = await cosmic.objects
      .find({ type: 'products', 'metadata.featured': true })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1)
    return response.objects as Product[]
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return []
    }
    throw new Error('Failed to fetch featured products')
  }
}

export async function getNewArrivals(): Promise<Product[]> {
  try {
    const response = await cosmic.objects
      .find({ type: 'products', 'metadata.new_arrival': true })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1)
    return response.objects as Product[]
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return []
    }
    throw new Error('Failed to fetch new arrivals')
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const response = await cosmic.objects
      .findOne({ type: 'products', slug })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1)
    return response.object as Product
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return null
    }
    throw new Error('Failed to fetch product')
  }
}

export async function getCategories(): Promise<Category[]> {
  try {
    const response = await cosmic.objects
      .find({ type: 'categories' })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1)
    return response.objects as Category[]
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return []
    }
    throw new Error('Failed to fetch categories')
  }
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  try {
    const response = await cosmic.objects
      .findOne({ type: 'categories', slug })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1)
    return response.object as Category
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return null
    }
    throw new Error('Failed to fetch category')
  }
}

export async function getProductsByCategory(categoryId: string): Promise<Product[]> {
  try {
    const response = await cosmic.objects
      .find({ type: 'products', 'metadata.category': categoryId })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1)
    return response.objects as Product[]
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return []
    }
    throw new Error('Failed to fetch products by category')
  }
}

// Order functions
export async function createOrder(orderData: {
  customerEmail: string;
  customerName: string;
  shippingAddress: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  stripePaymentIntentId: string;
  stripeSessionId?: string;
}): Promise<Order> {
  const response = await cosmic.objects.insertOne({
    title: `Order - ${orderData.customerEmail} - ${new Date().toISOString()}`,
    type: 'orders',
    metadata: {
      customer_email: orderData.customerEmail,
      customer_name: orderData.customerName,
      shipping_address: orderData.shippingAddress,
      items: orderData.items,
      subtotal: orderData.subtotal,
      shipping: orderData.shipping,
      tax: orderData.tax,
      total: orderData.total,
      status: 'Pending',
      stripe_payment_intent_id: orderData.stripePaymentIntentId,
      stripe_session_id: orderData.stripeSessionId || '',
    },
  })
  return response.object as Order
}

export async function getOrderBySessionId(sessionId: string): Promise<Order | null> {
  try {
    const response = await cosmic.objects
      .findOne({ type: 'orders', 'metadata.stripe_session_id': sessionId })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1)
    return response.object as Order
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return null
    }
    throw new Error('Failed to fetch order')
  }
}

export async function updateOrderStatus(orderId: string, status: string): Promise<void> {
  await cosmic.objects.updateOne(orderId, {
    metadata: {
      status,
    },
  })
}
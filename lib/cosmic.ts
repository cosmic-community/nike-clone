import { createBucketClient } from '@cosmicjs/sdk'
import { FeaturedBanner, Product, Category, User, Order, AboutPage, Article } from '@/types'

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

export async function getProductById(id: string): Promise<Product | null> {
  try {
    const response = await cosmic.objects
      .findOne({ type: 'products', id })
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

// About page function
export async function getAboutPage(): Promise<AboutPage | null> {
  try {
    const response = await cosmic.objects
      .findOne({ type: 'about-page', slug: 'about' })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1)
    return response.object as AboutPage
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return null
    }
    throw new Error('Failed to fetch about page')
  }
}

// News/Articles functions
export async function getArticles(): Promise<Article[]> {
  try {
    const response = await cosmic.objects
      .find({ type: 'articles' })
      .props(['id', 'title', 'slug', 'metadata', 'created_at'])
      .depth(1)
    
    // Sort by published_date descending (newest first)
    const articles = response.objects as Article[]
    return articles.sort((a, b) => {
      const dateA = new Date(a.metadata?.published_date || a.created_at).getTime()
      const dateB = new Date(b.metadata?.published_date || b.created_at).getTime()
      return dateB - dateA
    })
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return []
    }
    throw new Error('Failed to fetch articles')
  }
}

export async function getFeaturedArticles(): Promise<Article[]> {
  try {
    const response = await cosmic.objects
      .find({ type: 'articles', 'metadata.featured': true })
      .props(['id', 'title', 'slug', 'metadata', 'created_at'])
      .depth(1)
    
    const articles = response.objects as Article[]
    return articles.sort((a, b) => {
      const dateA = new Date(a.metadata?.published_date || a.created_at).getTime()
      const dateB = new Date(b.metadata?.published_date || b.created_at).getTime()
      return dateB - dateA
    })
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return []
    }
    throw new Error('Failed to fetch featured articles')
  }
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  try {
    const response = await cosmic.objects
      .findOne({ type: 'articles', slug })
      .props(['id', 'title', 'slug', 'metadata', 'created_at'])
      .depth(1)
    return response.object as Article
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return null
    }
    throw new Error('Failed to fetch article')
  }
}

// Authentication functions
export async function getUserByEmail(email: string): Promise<User | null> {
  try {
    const response = await cosmic.objects
      .find({ type: 'users', 'metadata.email': email })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1)
    
    if (response.objects && response.objects.length > 0) {
      return response.objects[0] as User
    }
    return null
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return null
    }
    throw new Error('Failed to fetch user')
  }
}

export async function getUserById(id: string): Promise<User | null> {
  try {
    const response = await cosmic.objects
      .findOne({ type: 'users', id })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1)
    return response.object as User
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return null
    }
    throw new Error('Failed to fetch user')
  }
}

export async function createUser(name: string, email: string, passwordHash: string): Promise<User> {
  const response = await cosmic.objects.insertOne({
    title: name,
    type: 'users',
    metadata: {
      name,
      email,
      password_hash: passwordHash,
      created_at: new Date().toISOString(),
    }
  })
  
  return response.object as User
}

export async function updateUser(id: string, updates: { name?: string; email?: string }): Promise<User> {
  const response = await cosmic.objects.updateOne(id, {
    title: updates.name,
    metadata: updates
  })
  
  return response.object as User
}

// Order functions
export async function createOrder(orderData: {
  customer_email: string;
  customer_name: string;
  shipping_address: string;
  items: any[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  status: string;
  stripe_payment_intent_id: string;
  stripe_session_id?: string;
}): Promise<Order> {
  const orderNumber = `ORD-${Date.now()}`
  const response = await cosmic.objects.insertOne({
    title: `Order ${orderNumber}`,
    type: 'orders',
    metadata: {
      ...orderData,
    }
  })
  
  return response.object as Order
}

export async function getOrdersByUserEmail(email: string): Promise<Order[]> {
  try {
    const response = await cosmic.objects
      .find({ type: 'orders', 'metadata.customer_email': email })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1)
    
    return response.objects as Order[]
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return []
    }
    throw new Error('Failed to fetch orders')
  }
}

export async function getOrderById(id: string): Promise<Order | null> {
  try {
    const response = await cosmic.objects
      .findOne({ type: 'orders', id })
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
export interface CosmicObject {
  id: string;
  slug: string;
  title: string;
  content?: string;
  type: string;
  created_at: string;
  modified_at: string;
}

export interface ImageFile {
  url: string;
  imgix_url: string;
}

export interface TextColor {
  key: string;
  value: string;
}

export interface FeaturedBanner extends CosmicObject {
  type: 'featured-banners';
  metadata: {
    headline: string;
    subheadline?: string;
    cta_text?: string;
    cta_link?: string;
    background_image: ImageFile;
    text_color?: TextColor;
  };
}

export interface Category extends CosmicObject {
  type: 'categories';
  metadata: {
    name: string;
    description?: string;
    image?: ImageFile;
  };
}

export interface Product extends CosmicObject {
  type: 'products';
  metadata: {
    name: string;
    subtitle?: string;
    description?: string;
    price: number;
    sale_price?: number | null;
    main_image: ImageFile;
    gallery?: ImageFile[];
    category?: Category;
    available_sizes?: string[];
    colors?: string[];
    featured?: boolean;
    new_arrival?: boolean;
  };
}

// News/Article types
export interface Article extends CosmicObject {
  type: 'articles';
  metadata: {
    title: string;
    excerpt?: string;
    content: string;
    featured_image: ImageFile;
    author?: string;
    published_date: string;
    category?: string;
    featured?: boolean;
  };
}

// Authentication types
export interface User extends CosmicObject {
  type: 'users';
  metadata: {
    name: string;
    email: string;
    password_hash: string;
    created_at?: string;
  };
}

export interface Order extends CosmicObject {
  type: 'orders';
  metadata: {
    customer_email: string;
    customer_name: string;
    shipping_address: string;
    items: OrderItem[];
    subtotal: number;
    shipping: number;
    tax: number;
    total: number;
    status: string;
    stripe_payment_intent_id: string;
    stripe_session_id?: string;
  };
}

export interface OrderItem {
  product_id: string;
  product_name: string;
  product_image?: string;
  quantity: number;
  size?: string;
  color?: string;
  price: number;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

// Shopping cart types
export interface CartItem {
  product: Product;
  quantity: number;
  size?: string;
  color?: string;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
}

// About page type
export interface AboutPage extends CosmicObject {
  type: 'about-page';
  metadata: {
    title: string;
    description?: string;
    mission_title?: string;
    mission_content?: string;
    values?: AboutValue[];
    hero_image?: ImageFile;
  };
}

export interface AboutValue {
  title: string;
  description: string;
}
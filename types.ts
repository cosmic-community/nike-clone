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

// Cart types
export interface CartItem {
  productId: string;
  productSlug: string;
  name: string;
  price: number;
  salePrice?: number | null;
  image: string;
  size: string;
  color: string;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

// Order types
export interface OrderItem {
  productId: string;
  productSlug: string;
  name: string;
  price: number;
  size: string;
  color: string;
  quantity: number;
  image: string;
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
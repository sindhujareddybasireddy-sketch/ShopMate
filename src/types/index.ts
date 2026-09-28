export interface ProductSpecification {
  processor?: string;
  ram?: string;
  storage?: string;
  display?: string;
  battery?: string;
  os?: string;
  connectivity?: string;
  weight?: string;
  warranty?: string;
  dimensions?: string;
  color?: string;
  [key: string]: string | undefined;
}

export interface ProductReview {
  id: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
  verifiedPurchase: boolean;
}

export interface Product {
  id: string;
  name: string;
  category: 'Laptops' | 'Mobiles' | 'Audio' | 'Smartwatches' | 'Monitors' | 'Accessories';
  brand: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  image: string;
  thumbnails?: string[];
  description: string;
  features: string[];
  specifications: ProductSpecification;
  availability: 'In Stock' | 'Only 2 Left' | 'Pre-order';
  trending?: boolean;
  isNew?: boolean;
  reviews?: ProductReview[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface FilterOptions {
  searchQuery: string;
  category: string;
  priceRange: string; // 'all' | 'under-30k' | '30k-50k' | '50k-70k' | 'above-70k'
  brands: string[];
  minRating: number;
  ram: string[];
  storage: string[];
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'rating' | 'newest';
}

export interface UserOrder {
  id: string;
  date: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  shippingAddress: {
    fullName: string;
    phone: string;
    email: string;
    street: string;
    city: string;
    state: string;
    pincode: string;
  };
  paymentMethod: string;
  status: 'Processing' | 'Shipped' | 'Delivered';
}

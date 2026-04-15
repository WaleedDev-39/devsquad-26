export interface Product {
  _id: string;
  name: string;
  description: string;
  images: string[];
  price: number;
  originalPrice: number | null;
  stock: number;
  category: string;
  subCategory: string;
  colors: string[];
  sizes: string[];
  rating: number;
  reviewCount: number;
  isOnSale: boolean;
  salePercent: number;
  purchaseType?: 'money' | 'points' | 'hybrid';
  pointsPrice?: number;
  earnedPoints?: number;
  brand: string;
  dressStyle: string;
  tags: string[];
  isNewArrival: boolean;
  isTopSelling: boolean;
  isActive: boolean;
  createdAt: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin' | 'superadmin';
  loyaltyPoints: number;
  createdAt: string;
}

export interface CartItem {
  _id: string;
  productId: string | Product;
  quantity: number;
  size: string;
  color: string;
  price: number;
  name: string;
  image: string;
}

export interface Cart {
  _id: string;
  userId: string;
  items: CartItem[];
}

export interface OrderItem {
  productId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  size: string;
  color: string;
}

export interface ShippingAddress {
  fullName: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  phone: string;
}

export interface Order {
  _id: string;
  userId: string | User;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  subtotal: number;
  discount: number;
  deliveryFee: number;
  total: number;
  totalAmount?: number;
  promoCode: string | null;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  loyaltyPointsEarned: number;
  loyaltyPointsSpent: number;
  paymentMethod: string;
  isPaid: boolean;
  createdAt: string;
}

export interface Review {
  _id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  parent: string | null;
}

export interface FilterState {
  category?: string;
  style?: string;
  color?: string;
  size?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
  page?: number;
}

export interface PaginatedProducts {
  products: Product[];
  total: number;
  page: number;
  totalPages: number;
}

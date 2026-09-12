export interface User {
  id: string;
  telegramId?: string;
  telegramUsername?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  role: 'USER' | 'ADMIN';
  referralCode?: string;
  balance: number;
  createdAt: Date;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  description?: string;
  icon?: string;
  order: number;
  isActive: boolean;
}

export interface ProductVariant {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  currency: string;
  isActive: boolean;
  stock: number;
  metadata?: Record<string, any>;
}

export interface Product {
  id: string;
  slug: string;
  categoryId: string;
  name: string;
  description?: string;
  image?: string;
  isActive: boolean;
  isFeatured: boolean;
  order: number;
  metadata?: Record<string, any>;
  category?: Category;
  variants?: ProductVariant[];
}

export interface OrderItem {
  id: string;
  productId: string;
  variantId: string;
  quantity: number;
  price: number;
  itemData?: Record<string, any>;
  product?: Product;
  variant?: ProductVariant;
}

export interface Order {
  id: string;
  userId: string;
  status: 'NEW' | 'AWAITING_PAYMENT' | 'PAID' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
  totalAmount: number;
  currency: string;
  discountAmount: number;
  finalAmount: number;
  orderData?: Record<string, any>;
  createdAt: Date;
  items?: OrderItem[];
}

export interface Payment {
  id: string;
  orderId: string;
  userId: string;
  amount: number;
  currency: string;
  status: 'PENDING' | 'PAID' | 'FAILED' | 'EXPIRED' | 'CANCELLED';
  provider: 'MOCK' | 'SBP';
  providerPaymentId?: string;
  providerData?: Record<string, any>;
  createdAt: Date;
}

export interface Banner {
  id: string;
  title: string;
  description?: string;
  image?: string;
  link?: string;
  order: number;
  isActive: boolean;
}

export interface CartItem {
  productId: string;
  variantId: string;
  quantity: number;
  product: Product;
  variant: ProductVariant;
}

export interface OrderFormData {
  telegramUsername?: string;
  telegramUserId?: string;
  email?: string;
  phone?: string;
  region?: string;
  platform?: string;
  gameUid?: string;
  login?: string;
  profileLink?: string;
  amount?: string;
  comment?: string;
}

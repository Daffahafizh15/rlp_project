export type Role = 'ADMIN' | 'CUSTOMER';

export type OrderStatus =
  | 'WAITING_PAYMENT'
  | 'PAYMENT_REVIEW'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'COMPLETED'
  | 'CANCELLED';

export type PaymentStatus =
  | 'PENDING'
  | 'WAITING_VERIFICATION'
  | 'PAID'
  | 'REJECTED';

export type PaymentMethod = 'BANK_TRANSFER' | 'QRIS';

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone?: string | null;
  role: Role;
  cartCount?: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  isActive: boolean;
  _count?: { products: number };
}

export interface ProductImage {
  id: string;
  productId: string;
  imageUrl: string;
  isPrimary: boolean;
  sortOrder: number;
}

export interface ProductVariant {
  id: string;
  productId: string;
  sku: string;
  size: string;
  color: string;
  price: number | string;
  stock: number;
  isActive: boolean;
}

export interface ProductCatalogItem {
  id: string;
  name: string;
  slug: string;
  basePrice: number | string;
  category: { id: string; name: string; slug: string };
  primaryImage: string | null;
  availableSizes: string[];
  availableColors: string[];
  totalStock: number;
  inStock: boolean;
  createdAt: string;
}

export interface ProductDetail {
  id: string;
  name: string;
  slug: string;
  description: string;
  basePrice: number | string;
  isActive: boolean;
  category: Category;
  images: ProductImage[];
  variants: ProductVariant[];
  createdAt: string;
}

export interface ShippingZone {
  id: string;
  name: string;
  description?: string | null;
  rate: number | string;
  isActive: boolean;
}

export interface Address {
  id: string;
  userId: string;
  label: string;
  recipientName: string;
  phoneNumber: string;
  fullAddress: string;
  city: string;
  province: string;
  postalCode: string;
  shippingZoneId: string;
  shippingZone?: ShippingZone;
  isDefault: boolean;
}

export interface CartItem {
  id: string;
  variantId: string;
  productId: string;
  productName: string;
  productSlug: string;
  category: string;
  sku: string;
  size: string;
  color: string;
  price: number;
  stock: number;
  quantity: number;
  subtotal: number;
  primaryImage: string | null;
  isOutOfStock: boolean;
  isQuantityExceeded: boolean;
}

export interface CartData {
  cartId: string;
  items: CartItem[];
  totalItems: number;
  subtotal: number;
}

export interface OrderItem {
  id: string;
  orderId: string;
  variantId?: string | null;
  productNameSnapshot: string;
  variantSkuSnapshot: string;
  sizeSnapshot: string;
  colorSnapshot: string;
  priceSnapshot: number | string;
  quantity: number;
  subtotal: number | string;
  variant?: {
    product?: {
      images?: { imageUrl: string }[];
    };
  };
}

export interface Payment {
  id: string;
  orderId: string;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  amount: number | string;
  proofImageUrl?: string | null;
  proofUploadedAt?: string | null;
  verifiedAt?: string | null;
  verifiedBy?: string | null;
  rejectionReason?: string | null;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  shippingZoneId: string;
  orderStatus: OrderStatus;
  subtotal: number | string;
  shippingCost: number | string;
  totalAmount: number | string;
  shippingAddressSnapshot: string;
  shippingAddress?: {
    recipientName: string;
    phoneNumber: string;
    fullAddress: string;
    city: string;
    province: string;
    postalCode: string;
    zoneName: string;
  };
  trackingNumber?: string | null;
  notes?: string | null;
  createdAt: string;
  user?: { id: string; fullName: string; email: string; phone?: string | null };
  shippingZone?: ShippingZone;
  items: OrderItem[];
  payment?: Payment | null;
}

export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  timestamp: string;
}

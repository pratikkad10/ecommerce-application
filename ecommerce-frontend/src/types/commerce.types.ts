export interface Color {
  id: string;
  name: string;
  hexCode?: string | null;
}

export interface Size {
  id: string;
  name: string;
}

export interface ProductImage {
  id: string;
  url: string;
  altText?: string | null;
  isPrimary: boolean;
}

export interface ProductVariant {
  id: string;
  sku: string;
  productId: string;
  sizeId?: string | null;
  size?: Size | null;
  colorId?: string | null;
  color?: Color | null;
  price?: number | string | null;
  stock: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  basePrice: number | string;
  gender: "MEN" | "WOMEN" | "KIDS" | "UNISEX";
  categoryId: string;
  brand: string;
  isFeatured: boolean;
  isActive: boolean;
  averageRating: number;
  numReviews: number;
  images?: ProductImage[];
  variants?: ProductVariant[];
  category?: {
    id: string;
    name: string;
    slug: string;
  };
}

// ─── Cart Types ────────────────────────────────────────────────

export interface CartItemVariant {
  id: string;
  sku: string;
  productId: string;
  price?: number | string | null;
  stock: number;
  size?: Size | null;
  color?: Color | null;
  product: {
    id: string;
    name: string;
    slug: string;
    basePrice: number | string;
    images?: ProductImage[];
  };
}

export interface CartItem {
  id: string;
  quantity: number;
  itemTotal: number;
  variant: CartItemVariant;
}

export interface CartSummary {
  totalItems: number;
  cartTotal: number;
}

export interface CartData {
  items: CartItem[];
  summary: CartSummary;
}

export interface AddToCartPayload {
  variantId: string;
  quantity: number;
}

export interface UpdateCartItemPayload {
  quantity: number;
}

// ─── Address Types ─────────────────────────────────────────────

export interface Address {
  id: string;
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  isDefault: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAddressPayload {
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  isDefault?: boolean;
}

export interface UpdateAddressPayload {
  street?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  isDefault?: boolean;
}

// ─── Order Types ───────────────────────────────────────────────

export type OrderStatus =
  | "PENDING"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

export type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "REFUNDED";

export interface OrderItem {
  id: string;
  orderId: string;
  variantId: string;
  quantity: number;
  unitPrice: number | string;
  productName: string;
  variantSku: string;
  sizeName?: string | null;
  colorName?: string | null;
  createdAt: string;
  variant?: {
    id: string;
    sku: string;
    size?: Size | null;
    color?: Color | null;
    product?: {
      id: string;
      name: string;
      images?: ProductImage[];
    };
  };
}

export interface Order {
  id: string;
  orderNumber: string;
  totalAmount: number | string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod?: string | null;
  transactionId?: string | null;
  shippingStreet: string;
  shippingCity: string;
  shippingState: string;
  shippingCountry: string;
  shippingPostalCode: string;
  userId: string;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface CheckoutPayload {
  shippingStreet: string;
  shippingCity: string;
  shippingState: string;
  shippingCountry: string;
  shippingZip: string;
  contactPhone: string;
}

export interface CheckoutResponseData {
  order: Order;
  razorpayOrderId: string;
  amount: number;
  currency: string;
}

export interface VerifyPaymentPayload {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

// ─── Review Types ──────────────────────────────────────────────

export interface ReviewUser {
  id: string;
  firstName: string;
  lastName?: string | null;
}

export interface Review {
  id: string;
  rating: number;
  comment?: string | null;
  productId: string;
  userId: string;
  user: ReviewUser;
  createdAt: string;
  updatedAt: string;
}

export interface CreateReviewPayload {
  productId: string;
  rating: number;
  comment?: string;
}

export interface UpdateReviewPayload {
  rating?: number;
  comment?: string;
}

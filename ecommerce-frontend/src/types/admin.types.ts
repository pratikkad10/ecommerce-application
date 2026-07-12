// ─── Admin Dashboard Stats ─────────────────────────────────────

export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalUsers: number;
  recentOrders: RecentOrder[];
}

export interface RecentOrder {
  id: string;
  orderNumber: string;
  totalAmount: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  createdAt: string;
  user: {
    firstName: string;
    lastName: string | null;
    email: string;
  };
}

// ─── Orders ────────────────────────────────────────────────────

export const ORDER_STATUS = {
  PENDING: "PENDING",
  PROCESSING: "PROCESSING",
  SHIPPED: "SHIPPED",
  DELIVERED: "DELIVERED",
  CANCELLED: "CANCELLED",
} as const;

export type OrderStatus = (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS];

export const PAYMENT_STATUS = {
  PENDING: "PENDING",
  PAID: "PAID",
  FAILED: "FAILED",
  REFUNDED: "REFUNDED",
} as const;

export type PaymentStatus =
  (typeof PAYMENT_STATUS)[keyof typeof PAYMENT_STATUS];

export interface AdminOrder {
  id: string;
  orderNumber: string;
  totalAmount: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: string | null;
  transactionId: string | null;
  shippingStreet: string;
  shippingCity: string;
  shippingState: string;
  shippingCountry: string;
  shippingPostalCode: string;
  createdAt: string;
  updatedAt: string;
  user: {
    firstName: string;
    lastName: string | null;
    email: string;
  };
  items: AdminOrderItem[];
}

export interface AdminOrderItem {
  id: string;
  quantity: number;
  unitPrice: string;
  productName: string;
  variantSku: string;
  sizeName: string | null;
  colorName: string | null;
  variant: {
    product: {
      images: Array<{
        id: string;
        url: string;
        isPrimary: boolean;
      }>;
    };
  };
}

// ─── Users ─────────────────────────────────────────────────────

export interface AdminUser {
  id: string;
  firstName: string;
  lastName: string | null;
  email: string;
  role: "CUSTOMER" | "ADMIN";
  isActive: boolean;
  createdAt: string;
  _count: {
    orders: number;
  };
}

export interface UpdateUserPayload {
  isActive?: boolean;
  role?: "CUSTOMER" | "ADMIN";
}

// ─── Products ──────────────────────────────────────────────────

export interface AdminProduct {
  id: string;
  name: string;
  slug: string;
  description: string;
  basePrice: string;
  gender: "MEN" | "WOMEN" | "KIDS" | "UNISEX";
  categoryId: string;
  brand: string;
  isFeatured: boolean;
  isActive: boolean;
  averageRating: number;
  numReviews: number;
  createdAt: string;
  updatedAt: string;
  category: {
    id: string;
    name: string;
    slug: string;
  };
  variants: AdminVariant[];
  images: AdminProductImage[];
}

export interface AdminVariant {
  id: string;
  sku: string;
  price: string | null;
  stock: number;
  sizeId: string | null;
  colorId: string | null;
  size: { id: string; name: string } | null;
  color: { id: string; name: string; hexCode: string | null } | null;
}

export interface AdminProductImage {
  id: string;
  url: string;
  publicId: string | null;
  altText: string | null;
  isPrimary: boolean;
}

export interface CreateProductPayload {
  name: string;
  description: string;
  basePrice: number;
  gender: "MEN" | "WOMEN" | "KIDS" | "UNISEX";
  categoryId: string;
  brand: string;
  isFeatured?: boolean;
}

export interface UpdateProductPayload extends Partial<CreateProductPayload> {
  isActive?: boolean;
}

export interface CreateVariantPayload {
  sizeId?: string;
  colorId?: string;
  price?: number;
  stock: number;
}

// ─── Categories ────────────────────────────────────────────────

export interface AdminCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryPayload {
  name: string;
  slug: string;
  description?: string;
}

// ─── Attributes ────────────────────────────────────────────────

export interface AdminColor {
  id: string;
  name: string;
  hexCode: string | null;
}

export interface AdminSize {
  id: string;
  name: string;
}

// ─── Pagination ────────────────────────────────────────────────

export interface PaginationMeta {
  totalCount: number;
  totalPages: number;
  currentPage: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMeta;
}

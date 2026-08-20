import { apiClient } from "../client";
import type {
  DashboardStats,
  AdminOrder,
  AdminUser,
  AdminProduct,
  AdminCategory,
  AdminColor,
  AdminSize,
  UpdateUserPayload,
  CreateProductPayload,
  UpdateProductPayload,
  CreateVariantPayload,
  CreateCategoryPayload,
  OrderStatus,
  PaginationMeta,
} from "../../types/admin.types";

// ─── Dashboard ─────────────────────────────────────────────────

export const getDashboardStats = async (): Promise<DashboardStats> => {
  const response = await apiClient.get("/admin/dashboard");
  return response.data.data;
};

// ─── Orders ────────────────────────────────────────────────────

export const getAdminOrders = async (
  page: number = 1,
  limit: number = 10
): Promise<{ orders: AdminOrder[]; pagination: PaginationMeta }> => {
  const response = await apiClient.get("/admin/orders", {
    params: { page, limit },
  });
  return response.data.data;
};

export const updateOrderStatus = async (
  orderId: string,
  status: OrderStatus
): Promise<AdminOrder> => {
  const response = await apiClient.put(`/admin/orders/${orderId}/status`, {
    status,
  });
  return response.data.data;
};

// ─── Users ─────────────────────────────────────────────────────

export const getAdminUsers = async (
  page: number = 1,
  limit: number = 10
): Promise<{ users: AdminUser[]; pagination: PaginationMeta }> => {
  const response = await apiClient.get("/admin/users", {
    params: { page, limit },
  });
  return response.data.data;
};

export const updateUser = async (
  userId: string,
  data: UpdateUserPayload
): Promise<{ id: string; email: string; role: string; isActive: boolean }> => {
  const response = await apiClient.put(`/admin/users/${userId}`, data);
  return response.data.data;
};

// ─── Products ──────────────────────────────────────────────────

export const getAdminProducts = async (
  params: Record<string, string | number | boolean | undefined> = {}
): Promise<{ products: AdminProduct[]; pagination: PaginationMeta }> => {
  const response = await apiClient.get("/products", { params });
  return response.data.data;
};

export const getAdminProduct = async (id: string): Promise<AdminProduct> => {
  const response = await apiClient.get(`/products/${id}`);
  return response.data.data;
};

export const createProduct = async (
  data: CreateProductPayload
): Promise<AdminProduct> => {
  const response = await apiClient.post("/products", data);
  return response.data.data;
};

export const updateProduct = async (
  id: string,
  data: UpdateProductPayload
): Promise<AdminProduct> => {
  const response = await apiClient.put(`/products/${id}`, data);
  return response.data.data;
};

export const deleteProduct = async (id: string): Promise<void> => {
  await apiClient.delete(`/products/${id}`);
};

// ─── Variants ──────────────────────────────────────────────────

export const createVariant = async (
  productId: string,
  data: CreateVariantPayload
): Promise<void> => {
  await apiClient.post(`/products/${productId}/variants`, data);
};

export const bulkCreateVariants = async (
  productId: string,
  variants: CreateVariantPayload[]
): Promise<void> => {
  await apiClient.post(`/products/${productId}/variants/bulk`, { variants });
};

export const deleteVariant = async (
  productId: string,
  variantId: string
): Promise<void> => {
  await apiClient.delete(`/products/${productId}/variants/${variantId}`);
};

// ─── Product Images ────────────────────────────────────────────

export const uploadProductImages = async (
  productId: string,
  files: File[]
): Promise<void> => {
  const formData = new FormData();
  files.forEach((file) => formData.append("images", file));

  await apiClient.post(`/products/${productId}/images`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const deleteProductImage = async (
  productId: string,
  imageId: string
): Promise<void> => {
  await apiClient.delete(`/products/${productId}/images/${imageId}`);
};

export const setPrimaryImage = async (
  productId: string,
  imageId: string
): Promise<void> => {
  await apiClient.patch(`/products/${productId}/images/${imageId}/primary`);
};

// ─── Categories ────────────────────────────────────────────────

export const getCategories = async (): Promise<AdminCategory[]> => {
  const response = await apiClient.get("/categories");
  return response.data.data;
};

export const createCategory = async (
  data: CreateCategoryPayload
): Promise<AdminCategory> => {
  const response = await apiClient.post("/categories", data);
  return response.data.data;
};

export const updateCategory = async (
  id: string,
  data: Partial<CreateCategoryPayload>
): Promise<AdminCategory> => {
  const response = await apiClient.put(`/categories/${id}`, data);
  return response.data.data;
};

export const deleteCategory = async (id: string): Promise<void> => {
  await apiClient.delete(`/categories/${id}`);
};

// ─── Colors ────────────────────────────────────────────────────

export const getColors = async (): Promise<AdminColor[]> => {
  const response = await apiClient.get("/colors");
  return response.data.data;
};

export const createColor = async (data: {
  name: string;
  hexCode?: string;
}): Promise<AdminColor> => {
  const response = await apiClient.post("/colors", data);
  return response.data.data;
};

export const deleteColor = async (id: string): Promise<void> => {
  await apiClient.delete(`/colors/${id}`);
};

// ─── Sizes ─────────────────────────────────────────────────────

export const getSizes = async (): Promise<AdminSize[]> => {
  const response = await apiClient.get("/sizes");
  return response.data.data;
};

export const createSize = async (data: {
  name: string;
}): Promise<AdminSize> => {
  const response = await apiClient.post("/sizes", data);
  return response.data.data;
};

export const deleteSize = async (id: string): Promise<void> => {
  await apiClient.delete(`/sizes/${id}`);
};

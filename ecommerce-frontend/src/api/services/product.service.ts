import { apiClient } from "../client";

export interface GetProductsParams {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
  brand?: string;
  gender?: string;
  minPrice?: number;
  maxPrice?: number;
  isFeatured?: boolean;
  sort?: "price_asc" | "price_desc" | "newest" | "rating";
}

export const getProducts = async (params: GetProductsParams = {}) => {
  const response = await apiClient.get('/products', { params });
  return response.data;
};

export const getProductById = async (id: string) => {
  const response = await apiClient.get(`/products/${id}`);
  return response.data;
};

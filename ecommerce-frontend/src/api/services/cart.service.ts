import { apiClient } from "../client";
import type {
  CartData,
  AddToCartPayload,
  UpdateCartItemPayload,
} from "../../types/commerce.types";

/**
 * Fetches current user's cart with items and summary.
 */
export const getCart = async (): Promise<{ success: boolean; message: string; data: CartData }> => {
  const response = await apiClient.get<{
    success: boolean;
    message: string;
    data: CartData;
  }>("/cart");
  return response.data;
};

/**
 * Adds a product variant to the cart.
 */
export const addToCart = async (
  payload: AddToCartPayload
): Promise<{ success: boolean; message: string; data: any }> => {
  const response = await apiClient.post<{
    success: boolean;
    message: string;
    data: any;
  }>("/cart", payload);
  return response.data;
};

/**
 * Updates quantity of a specific cart item.
 */
export const updateCartItem = async (
  cartItemId: string,
  payload: UpdateCartItemPayload
): Promise<{ success: boolean; message: string; data: any }> => {
  const response = await apiClient.put<{
    success: boolean;
    message: string;
    data: any;
  }>(`/cart/${cartItemId}`, payload);
  return response.data;
};

/**
 * Removes a single item from the cart.
 */
export const removeCartItem = async (
  cartItemId: string
): Promise<{ success: boolean; message: string }> => {
  const response = await apiClient.delete<{
    success: boolean;
    message: string;
  }>(`/cart/${cartItemId}`);
  return response.data;
};

/**
 * Clears all items from user's cart.
 */
export const clearCart = async (): Promise<{ success: boolean; message: string }> => {
  const response = await apiClient.delete<{
    success: boolean;
    message: string;
  }>("/cart");
  return response.data;
};

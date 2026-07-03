import { apiClient } from "../client";

export const getWishlist = async () => {
  const response = await apiClient.get('/wishlist');
  return response.data;
};

export const addToWishlist = async (productId: string) => {
  const response = await apiClient.post('/wishlist', { productId });
  return response.data;
};

export const removeFromWishlist = async (productId: string) => {
  const response = await apiClient.delete(`/wishlist/${productId}`);
  return response.data;
};

export const clearWishlist = async () => {
  const response = await apiClient.delete('/wishlist');
  return response.data;
};

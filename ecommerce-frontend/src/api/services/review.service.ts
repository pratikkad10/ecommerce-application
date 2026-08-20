import { apiClient } from "../client";
import type {
  Review,
  CreateReviewPayload,
  UpdateReviewPayload,
} from "../../types/commerce.types";

/**
 * Fetches all reviews for a product.
 */
export const getProductReviews = async (
  productId: string
): Promise<{ success: boolean; data: Review[] }> => {
  const response = await apiClient.get<{
    success: boolean;
    data: Review[];
  }>(`/reviews/product/${productId}`);
  return response.data;
};

/**
 * Submits a new review for a product.
 */
export const createReview = async (
  payload: CreateReviewPayload
): Promise<{ success: boolean; message: string; data: Review }> => {
  const response = await apiClient.post<{
    success: boolean;
    message: string;
    data: Review;
  }>("/reviews", payload);
  return response.data;
};

/**
 * Updates an existing review.
 */
export const updateReview = async (
  reviewId: string,
  payload: UpdateReviewPayload
): Promise<{ success: boolean; message: string; data: Review }> => {
  const response = await apiClient.put<{
    success: boolean;
    message: string;
    data: Review;
  }>(`/reviews/${reviewId}`, payload);
  return response.data;
};

/**
 * Deletes a review.
 */
export const deleteReview = async (
  reviewId: string
): Promise<{ success: boolean; message: string }> => {
  const response = await apiClient.delete<{
    success: boolean;
    message: string;
  }>(`/reviews/${reviewId}`);
  return response.data;
};

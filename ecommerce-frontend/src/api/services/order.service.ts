import { apiClient } from "../client";
import type {
  Order,
  CheckoutPayload,
  CheckoutResponseData,
  VerifyPaymentPayload,
} from "../../types/commerce.types";

/**
 * Initializes checkout with shipping address and contacts Razorpay.
 */
export const initializeCheckout = async (
  payload: CheckoutPayload
): Promise<{ success: boolean; message: string; data: CheckoutResponseData }> => {
  const response = await apiClient.post<{
    success: boolean;
    message: string;
    data: CheckoutResponseData;
  }>("/orders/checkout", payload);
  return response.data;
};

/**
 * Verifies Razorpay payment signature and marks order as paid/processing.
 */
export const verifyPayment = async (
  payload: VerifyPaymentPayload
): Promise<{ success: boolean; message: string; data: { success: boolean; orderId: string } }> => {
  const response = await apiClient.post<{
    success: boolean;
    message: string;
    data: { success: boolean; orderId: string };
  }>("/orders/verify", payload);
  return response.data;
};

/**
 * Fetches all past orders for the authenticated user.
 */
export const getUserOrders = async (): Promise<{ success: boolean; message: string; data: Order[] }> => {
  const response = await apiClient.get<{
    success: boolean;
    message: string;
    data: Order[];
  }>("/orders");
  return response.data;
};

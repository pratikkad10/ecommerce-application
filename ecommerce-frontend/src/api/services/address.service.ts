import { apiClient } from "../client";
import type {
  Address,
  CreateAddressPayload,
  UpdateAddressPayload,
} from "../../types/commerce.types";

/**
 * Fetches all saved delivery addresses for the logged-in user.
 */
export const getAddresses = async (): Promise<{ success: boolean; data: Address[] }> => {
  const response = await apiClient.get<{
    success: boolean;
    data: Address[];
  }>("/addresses");
  return response.data;
};

/**
 * Adds a new delivery address.
 */
export const createAddress = async (
  payload: CreateAddressPayload
): Promise<{ success: boolean; message: string; data: Address }> => {
  const response = await apiClient.post<{
    success: boolean;
    message: string;
    data: Address;
  }>("/addresses", payload);
  return response.data;
};

/**
 * Updates an existing delivery address.
 */
export const updateAddress = async (
  addressId: string,
  payload: UpdateAddressPayload
): Promise<{ success: boolean; message: string; data: Address }> => {
  const response = await apiClient.put<{
    success: boolean;
    message: string;
    data: Address;
  }>(`/addresses/${addressId}`, payload);
  return response.data;
};

/**
 * Deletes a delivery address.
 */
export const deleteAddress = async (
  addressId: string
): Promise<{ success: boolean; message: string }> => {
  const response = await apiClient.delete<{
    success: boolean;
    message: string;
  }>(`/addresses/${addressId}`);
  return response.data;
};

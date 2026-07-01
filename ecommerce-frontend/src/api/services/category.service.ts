import { apiClient } from "../client";

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export const getCategories = async () => {
  const response = await apiClient.get('/categories');
  return response.data;
};

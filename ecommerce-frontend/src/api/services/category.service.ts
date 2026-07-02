import { apiClient } from "../client";

export interface Category {
  id: string;
  name: string;
  slug: string;
  image?: string | null;
}

export const getCategories = async () => {
  const response = await apiClient.get('/categories');
  return response.data;
};

import axios, { AxiosError, type AxiosResponse } from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

export const apiClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // send httpOnly cookies automatically
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

// Response interceptor — normalize error messages
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError<{ message?: string; errors?: Array<{ message: string }> }>) => {
    const message =
      error.response?.data?.message ||
      error.response?.data?.errors?.[0]?.message ||
      error.message ||
      "An unexpected error occurred";

    return Promise.reject(new Error(message));
  }
);

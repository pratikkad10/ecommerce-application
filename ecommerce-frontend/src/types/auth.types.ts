export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName?: string | null;
  phone?: string | null;
  role: "CUSTOMER" | "ADMIN";
  isEmailVerified: boolean;
  createdAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  user: User;
  token?: string;
}

export interface ApiError {
  message: string;
  errors?: Array<{ message: string; path?: string[] }>;
}

import { apiClient } from "../client";
import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  User,
} from "../../types/auth.types";

/**
 * Registers a new user account.
 * Backend sends a verification email — in dev, token is printed to console.
 */
export const register = async (data: RegisterRequest): Promise<{ message: string }> => {
  const response = await apiClient.post<{ message: string }>("/auth/register", data);
  return response.data;
};

/**
 * Logs in an existing user.
 * Sets an httpOnly `auth_token` cookie on the backend.
 * Also caches the returned token in localStorage for Authorization header.
 */
export const login = async (data: LoginRequest): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>("/auth/login", data);
  return response.data;
};

/**
 * Fetches the currently authenticated user from the session.
 * Uses the httpOnly cookie (or bearer token) for authentication.
 */
export const getCurrentUser = async (): Promise<User> => {
  const response = await apiClient.get<{ message: string; user: User }>("/auth/me");
  return response.data.user;
};

/**
 * Logs out the current user, clearing the server-side cookie.
 */
export const logout = async (): Promise<void> => {
  await apiClient.get("/auth/logout");
};

/**
 * Verifies a user's email using the token from the verification link.
 */
export const verifyEmail = async (token: string): Promise<{ message: string }> => {
  const response = await apiClient.get<{ message: string }>(`/auth/verify-email?token=${token}`);
  return response.data;
};

/**
 * Resends the verification email to a given email address.
 */
export const resendVerificationEmail = async (email: string): Promise<{ message: string }> => {
  const response = await apiClient.post<{ message: string }>("/auth/resend-verification-email", { email });
  return response.data;
};

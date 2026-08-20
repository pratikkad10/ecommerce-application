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

/**
 * Sends a password reset link to a given email address.
 */
export const forgotPassword = async (email: string): Promise<{ message: string }> => {
  const response = await apiClient.post<{ message: string }>("/auth/forgot-password", { email });
  return response.data;
};

/**
 * Resets user password using the token provided in the URL query string.
 */
export const resetPassword = async (
  token: string,
  data: { password: string; confirmPassword: string }
): Promise<{ message: string }> => {
  const response = await apiClient.post<{ message: string }>(
    `/auth/reset-password?token=${token}`,
    data
  );
  return response.data;
};

/**
 * Updates the user password (requires active login session).
 */
export const updatePassword = async (data: {
  oldPassword: string;
  newPassword: string;
}): Promise<{ message: string }> => {
  const response = await apiClient.put<{ message: string }>("/auth/update-password", data);
  return response.data;
};

/**
 * Updates user email and sends a verification link to the new address.
 */
export const updateEmail = async (data: {
  email: string;
}): Promise<{ message: string }> => {
  const response = await apiClient.put<{ message: string }>("/auth/update-email", data);
  return response.data;
};

/**
 * Updates user profile details (firstName, lastName, phone).
 */
export const updateProfile = async (data: {
  firstName?: string;
  lastName?: string;
  phone?: string;
}): Promise<{ message: string; user: User }> => {
  const response = await apiClient.put<{ message: string; user: User }>("/auth/profile", data);
  return response.data;
};

/**
 * Permanently deletes the current user's account.
 */
export const deleteAccount = async (): Promise<{ message: string }> => {
  const response = await apiClient.delete<{ message: string }>("/auth/account");
  return response.data;
};


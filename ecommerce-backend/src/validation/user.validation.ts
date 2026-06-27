import { z } from "zod";

/**
 * Schema for user registration validation
 */
export const userRegisterSchema = z.object({
    firstName: z.string(),
    lastName: z.string(),
    phone: z.string().optional(),
    email: z.string().email(),
    password: z.string().min(6, "Password must be at least 6 characters"),
    role: z.enum(["CUSTOMER", "ADMIN"]).default("CUSTOMER"),
});

export type UserRegisterType = z.infer<typeof userRegisterSchema>;

/**
 * Schema for user login validation
 */
export const userLoginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

export type UserLoginType = z.infer<typeof userLoginSchema>;

/**
 * Schema for updating user password
 */
export const updatePasswordSchema = z.object({
    oldPassword: z.string().min(6, "Old password must be at least 6 characters"),
    newPassword: z.string().min(6, "New password must be at least 6 characters"),
    confirmNewPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "New passwords do not match",
    path: ["confirmNewPassword"],
});

/**
 * Schema for updating user email
 */
export const updateEmailSchema = z.object({
    email: z.string().email("Please provide a valid email address"),
});
import { z } from "zod";


/**
 * Schema for user registration validation
 */
export const userRegisterSchema = z.object({
    firstName: z.string(),
    lastName: z.string(),
    phone: z.string().optional(),
    email: z.string().email(),
    password: z.string().min(6),
    role: z.enum(["CUSTOMER", "ADMIN"]).default("CUSTOMER"),
});

/**
 * Schema for user login validation
 */
export const userLoginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
});

export type UserRegisterType = z.infer<typeof userRegisterSchema>;

export type UserLoginType = z.infer<typeof userLoginSchema>;

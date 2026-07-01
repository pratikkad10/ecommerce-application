import { z } from "zod";

export const updateOrderStatusSchema = z.object({
    status: z.enum(["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"], {
        message: "Invalid status value. Must be PENDING, PROCESSING, SHIPPED, DELIVERED, or CANCELLED."
    })
});

export const updateUserStatusSchema = z.object({
    isActive: z.boolean().optional(),
    role: z.enum(["CUSTOMER", "ADMIN"]).optional()
});

export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;
export type UpdateUserStatusInput = z.infer<typeof updateUserStatusSchema>;

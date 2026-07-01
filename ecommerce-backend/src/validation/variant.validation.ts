import { z } from "zod";

export const createVariantSchema = z.object({
    sku: z.string().min(3, "SKU must be at least 3 characters long"),
    sizeId: z.string().uuid("Invalid size ID").optional(),
    colorId: z.string().uuid("Invalid color ID").optional(),
    price: z.number().positive("Price must be a positive number").optional(),
    stock: z.number().int().min(0, "Stock cannot be negative").default(0)
});

export const updateVariantSchema = z.object({
    sku: z.string().min(3, "SKU must be at least 3 characters long").optional(),
    sizeId: z.string().uuid("Invalid size ID").optional().nullable(),
    colorId: z.string().uuid("Invalid color ID").optional().nullable(),
    price: z.number().positive("Price must be a positive number").optional().nullable(),
    stock: z.number().int().min(0, "Stock cannot be negative").optional()
});

export const bulkCreateVariantSchema = z.array(createVariantSchema).min(1, "At least one variant must be provided");

export type CreateVariantInput = z.infer<typeof createVariantSchema>;
export type UpdateVariantInput = z.infer<typeof updateVariantSchema>;
export type BulkCreateVariantInput = z.infer<typeof bulkCreateVariantSchema>;

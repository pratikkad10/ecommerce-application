import { z } from "zod";

export const createProductSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters long"),
    description: z.string().min(10, "Description must be at least 10 characters long"),
    basePrice: z.number().positive("Base price must be a positive number"),
    category: z.string().min(2, "Category is required"),
    brand: z.string().min(2, "Brand is required"),
    gender: z.enum(["MEN", "WOMEN", "KIDS", "UNISEX"]).default("UNISEX"),
    isFeatured: z.boolean().default(false),
    isActive: z.boolean().default(true)
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
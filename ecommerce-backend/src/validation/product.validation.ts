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

export const updateProductSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters long").optional(),
    description: z.string().min(10, "Description must be at least 10 characters long").optional(),
    basePrice: z.number().positive("Base price must be a positive number").optional(),
    category: z.string().min(2, "Category is required").optional(),
    brand: z.string().min(2, "Brand is required").optional(),
    gender: z.enum(["MEN", "WOMEN", "KIDS", "UNISEX"]).optional(),
    isFeatured: z.boolean().optional(),
    isActive: z.boolean().optional()
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;

export const productQuerySchema = z.object({
    search: z.string().optional(),
    category: z.string().optional(),
    brand: z.string().optional(),
    gender: z.enum(["MEN", "WOMEN", "KIDS", "UNISEX"]).optional(),
    minPrice: z.string().optional().transform(val => (val && !isNaN(parseFloat(val)) ? parseFloat(val) : undefined)),
    maxPrice: z.string().optional().transform(val => (val && !isNaN(parseFloat(val)) ? parseFloat(val) : undefined)),
    isFeatured: z.string().optional().transform(val => val === "true" ? true : val === "false" ? false : undefined),
    sort: z.enum(["price_asc", "price_desc", "newest", "rating"]).optional().default("newest")
});

export type ProductQueryInput = z.infer<typeof productQuerySchema>;
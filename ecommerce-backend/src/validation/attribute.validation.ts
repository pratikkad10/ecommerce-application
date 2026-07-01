import { z } from "zod";

export const createSizeSchema = z.object({
    name: z.string().min(1, "Size name is required")
});

export const updateSizeSchema = z.object({
    name: z.string().min(1, "Size name is required").optional()
});

export const createColorSchema = z.object({
    name: z.string().min(1, "Color name is required"),
    hexCode: z.string().regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, "Invalid hex code").optional().nullable()
});

export const updateColorSchema = z.object({
    name: z.string().min(1, "Color name is required").optional(),
    hexCode: z.string().regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, "Invalid hex code").optional().nullable()
});

export type CreateSizeInput = z.infer<typeof createSizeSchema>;
export type UpdateSizeInput = z.infer<typeof updateSizeSchema>;
export type CreateColorInput = z.infer<typeof createColorSchema>;
export type UpdateColorInput = z.infer<typeof updateColorSchema>;

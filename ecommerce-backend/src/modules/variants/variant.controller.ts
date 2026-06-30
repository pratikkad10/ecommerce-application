import { Request, Response } from "express";
import { createVariantSchema, updateVariantSchema } from "../../validation/variant.validation";
import { 
    getVariantsByProductId, 
    getVariantById, 
    createNewVariant, 
    updateExistingVariant, 
    deleteExistingVariant,
    checkVariantExists
} from "../../services/variant.service";
import { getProductById } from "../../services/product.service";

/**
 * Get all variants for a product
 * @route GET /api/v1/products/:productId/variants
 */
export const getProductVariants = async (req: Request<{ productId: string }>, res: Response) => {
    try {
        const { productId } = req.params;

        const product = await getProductById(productId);
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        const variants = await getVariantsByProductId(productId);

        return res.status(200).json({
            success: true,
            message: "Variants retrieved successfully",
            data: variants,
        });
    } catch (error) {
        console.error("error fetching variants", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

/**
 * Get a single variant by ID
 * @route GET /api/v1/products/:productId/variants/:variantId
 */
export const getSingleVariant = async (req: Request<{ productId: string, variantId: string }>, res: Response) => {
    try {
        const { variantId } = req.params;

        const variant = await getVariantById(variantId);

        if (!variant) {
            return res.status(404).json({ success: false, message: "Variant not found" });
        }

        return res.status(200).json({
            success: true,
            message: "Variant retrieved successfully",
            data: variant,
        });
    } catch (error) {
        console.error("error fetching single variant", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

/**
 * Create a new variant for a product
 * @route POST /api/v1/products/:productId/variants
 * @access Private (Admin only)
 */
export const createVariant = async (req: Request<{ productId: string }>, res: Response) => {
    try {
        const { productId } = req.params;

        const product = await getProductById(productId);
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        const validation = createVariantSchema.safeParse(req.body);

        if (!validation.success) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: validation.error.format(),
            });
        }

        const data = validation.data;

        // Check if variant with same size and color already exists
        const existingVariant = await checkVariantExists(productId, data.sizeId, data.colorId);
        if (existingVariant) {
            return res.status(409).json({ 
                success: false, 
                message: "A variant with this size and color combination already exists for this product" 
            });
        }

        const variant = await createNewVariant(productId, data);

        return res.status(201).json({
            success: true,
            message: "Variant created successfully",
            data: variant,
        });
    } catch (error: any) {
        console.error("error creating variant", error);
        if (error.code === 'P2002') {
             return res.status(409).json({ success: false, message: "A variant with this SKU already exists" });
        }
        return res.status(500).json({ error: "Internal server error" });
    }
};

/**
 * Update a variant
 * @route PUT /api/v1/products/:productId/variants/:variantId
 * @access Private (Admin only)
 */
export const updateVariant = async (req: Request<{ productId: string, variantId: string }>, res: Response) => {
    try {
        const { variantId, productId } = req.params;

        const validation = updateVariantSchema.safeParse(req.body);

        if (!validation.success) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: validation.error.format(),
            });
        }

        const data = validation.data;

        // Verify variant exists and belongs to product
        const existingVariant = await getVariantById(variantId);
        if (!existingVariant || existingVariant.productId !== productId) {
            return res.status(404).json({ success: false, message: "Variant not found" });
        }

        const variant = await updateExistingVariant(variantId, data);

        return res.status(200).json({
            success: true,
            message: "Variant updated successfully",
            data: variant,
        });
    } catch (error: any) {
        console.error("error updating variant", error);
        if (error.code === 'P2002') {
             return res.status(409).json({ success: false, message: "A variant with this SKU already exists" });
        }
        return res.status(500).json({ error: "Internal server error" });
    }
};

/**
 * Delete a variant
 * @route DELETE /api/v1/products/:productId/variants/:variantId
 * @access Private (Admin only)
 */
export const deleteVariant = async (req: Request<{ productId: string, variantId: string }>, res: Response) => {
    try {
        const { variantId, productId } = req.params;

        const existingVariant = await getVariantById(variantId);
        if (!existingVariant || existingVariant.productId !== productId) {
            return res.status(404).json({ success: false, message: "Variant not found" });
        }

        const variant = await deleteExistingVariant(variantId);

        return res.status(200).json({
            success: true,
            message: "Variant deleted successfully",
            data: variant,
        });
    } catch (error) {
        console.error("error deleting variant", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

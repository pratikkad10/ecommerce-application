import express from "express";
import { 
    getProductVariants, 
    getSingleVariant, 
    createVariant, 
    updateVariant, 
    deleteVariant 
} from "../modules/variants/variant.controller";
import { requireAuth } from "../middlewares/auth.middleware";

// We use mergeParams to access :productId from the parent router (product.routes.ts)
const router = express.Router({ mergeParams: true });

/**
 * @description Get all variants for a product
 * @route GET /api/v1/products/:productId/variants
 * @access Public
 */
router.get("/", getProductVariants);

/**
 * @description Get a specific variant
 * @route GET /api/v1/products/:productId/variants/:variantId
 * @access Public
 */
router.get("/:variantId", getSingleVariant);

/**
 * @description Create a new variant for a product
 * @route POST /api/v1/products/:productId/variants
 * @access Private (Admin only)
 */
router.post("/", requireAuth(["ADMIN"]), createVariant);

/**
 * @description Update an existing variant
 * @route PUT /api/v1/products/:productId/variants/:variantId
 * @access Private (Admin only)
 */
router.put("/:variantId", requireAuth(["ADMIN"]), updateVariant);

/**
 * @description Delete a variant
 * @route DELETE /api/v1/products/:productId/variants/:variantId
 * @access Private (Admin only)
 */
router.delete("/:variantId", requireAuth(["ADMIN"]), deleteVariant);

export default router;

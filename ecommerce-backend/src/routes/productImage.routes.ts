import express from "express";
import {
    uploadProductImages,
    deleteSingleImage,
    setImageAsPrimary,
} from "../modules/products/productImage.controller";
import { requireAuth } from "../middlewares/auth.middleware";
import { upload } from "../config/multer.config";

const router = express.Router({ mergeParams: true });

/**
 * @description Upload images for a product
 * @route POST /api/v1/products/:productId/images
 * @access Private (Admin only)
 */
router.post(
    "/",
    requireAuth(["ADMIN"]),
    upload.array("images", 10),
    uploadProductImages
);

/**
 * @description Delete a product image
 * @route DELETE /api/v1/products/:productId/images/:imageId
 * @access Private (Admin only)
 */
router.delete("/:imageId", requireAuth(["ADMIN"]), deleteSingleImage);

/**
 * @description Set an image as primary
 * @route PATCH /api/v1/products/:productId/images/:imageId/primary
 * @access Private (Admin only)
 */
router.patch("/:imageId/primary", requireAuth(["ADMIN"]), setImageAsPrimary);

export default router;
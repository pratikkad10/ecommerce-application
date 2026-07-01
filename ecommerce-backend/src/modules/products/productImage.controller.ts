import { Request, Response } from "express";
import { getProductById } from "../../services/product.service";
import { createProductImages, deleteProductImage, setPrimaryImage } from "../../services/productImage.service";

/**
 * @description Upload Images for a Product
 * @route POST /api/v1/products/:productId/images
 * @access Private
 * @returns {
 *  success: boolean,
 *  message: string,
 *  data: ProductImage[]
 * }
 */
export const uploadProductImages = async (
    req: Request<{ productId: string }>,
    res: Response
) => {
    try {
        const { productId } = req.params;

        // Validate product exists before uploading
        const product = await getProductById(productId);
        if (!product) {
            return res
                .status(404)
                .json({ success: false, message: "Product not found" });
        }

        // Multer puts files in req.files
        const files = req.files as Express.Multer.File[] | undefined;
        if (!files || files.length === 0) {
            return res
                .status(400)
                .json({ success: false, message: "At least one image is required" });
        }

        const altText = req.body.altText as string | undefined;

        const images = await createProductImages(productId, files, altText);

        return res.status(201).json({
            success: true,
            message: "Images uploaded successfully",
            data: images,
        });
    } catch (error) {
        console.error("error uploading images", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

/**
 * @description Delete a single image of a product
 * @route DELETE /api/v1/products/:productId/images/:imageId
 * @access Private
 * @returns {
 *  success: boolean,
 *  message: string,
 *  data: ProductImage
 * }
 */
export const deleteSingleImage = async (
    req: Request<{ productId: string; imageId: string }>,
    res: Response
) => {
    try {
        const { productId, imageId } = req.params;

        const deleted = await deleteProductImage(imageId, productId);

        if (!deleted) {
            return res
                .status(404)
                .json({ success: false, message: "Image not found" });
        }

        return res.status(200).json({
            success: true,
            message: "Image deleted successfully",
            data: deleted,
        });
    } catch (error) {
        console.error("error deleting image", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

/**
 * @description Set an image as the primary image for a product
 * @route PATCH /api/v1/products/:productId/images/:imageId/primary
 * @access Private
 * @returns {
 *  success: boolean,
 *  message: string,
 *  data: ProductImage
 * }
 */
export const setImageAsPrimary = async (
    req: Request<{ productId: string; imageId: string }>,
    res: Response
) => {
    try {
        const { productId, imageId } = req.params;

        const result = await setPrimaryImage(productId, imageId);

        if (!result) {
            return res
                .status(404)
                .json({ success: false, message: "Image not found" });
        }

        return res.status(200).json({
            success: true,
            message: "Primary image updated successfully",
        });
    } catch (error) {
        console.error("error setting primary image", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};
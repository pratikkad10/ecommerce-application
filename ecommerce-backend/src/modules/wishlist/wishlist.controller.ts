import { Request, Response } from "express";
import { 
    getUserWishlist, 
    addToWishlist, 
    removeFromWishlist, 
    clearUserWishlist 
} from "../../services/wishlist.service";
import { addToWishlistSchema } from "../../validation/wishlist.validation";
import { getProductById } from "../../services/product.service";

/**
 * Get current user's wishlist
 * @route GET /api/v1/wishlist
 * @access Private
 */
export const getWishlistController = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const wishlistItems = await getUserWishlist(userId);

        return res.status(200).json({
            success: true,
            message: "Wishlist retrieved successfully",
            data: wishlistItems,
        });
    } catch (error) {
        console.error("error fetching wishlist", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

/**
 * Add a product to wishlist
 * @route POST /api/v1/wishlist
 * @access Private
 */
export const addToWishlistController = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const validation = addToWishlistSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: validation.error.format(),
            });
        }

        // Verify the product actually exists
        const product = await getProductById(validation.data.productId);
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        const wishlistItem = await addToWishlist(userId, validation.data.productId);

        return res.status(201).json({
            success: true,
            message: "Product added to wishlist successfully",
            data: wishlistItem,
        });
    } catch (error: any) {
        console.error("error adding to wishlist", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

/**
 * Remove a product from wishlist
 * @route DELETE /api/v1/wishlist/:productId
 * @access Private
 */
export const removeFromWishlistController = async (req: Request<{ productId: string }>, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const { productId } = req.params;
        
        const deletedItem = await removeFromWishlist(userId, productId);
        if (!deletedItem) {
            return res.status(404).json({ success: false, message: "Product not found in wishlist" });
        }

        return res.status(200).json({
            success: true,
            message: "Product removed from wishlist successfully",
        });
    } catch (error: any) {
        console.error("error removing from wishlist", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

/**
 * Clear the user's wishlist
 * @route DELETE /api/v1/wishlist
 * @access Private
 */
export const clearWishlistController = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        await clearUserWishlist(userId);

        return res.status(200).json({
            success: true,
            message: "Wishlist cleared successfully",
        });
    } catch (error: any) {
        console.error("error clearing wishlist", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

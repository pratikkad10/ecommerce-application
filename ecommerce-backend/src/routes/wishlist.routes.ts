import express from "express";
import { 
    getWishlistController, 
    addToWishlistController, 
    removeFromWishlistController, 
    clearWishlistController 
} from "../modules/wishlist/wishlist.controller";
import { requireAuth } from "../middlewares/auth.middleware";

const router = express.Router();

/**
 * @description Get current user's wishlist
 * @route GET /api/v1/wishlist
 * @access Private
 */
router.get("/", requireAuth(), getWishlistController);

/**
 * @description Add a product to the wishlist
 * @route POST /api/v1/wishlist
 * @access Private
 */
router.post("/", requireAuth(), addToWishlistController);

/**
 * @description Clear the entire wishlist
 * @route DELETE /api/v1/wishlist
 * @access Private
 */
router.delete("/", requireAuth(), clearWishlistController);

/**
 * @description Remove a single product from the wishlist
 * @route DELETE /api/v1/wishlist/:productId
 * @access Private
 */
router.delete("/:productId", requireAuth(), removeFromWishlistController);

export default router;

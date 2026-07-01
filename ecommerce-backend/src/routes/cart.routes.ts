import express from "express";
import { 
    getCartController, 
    addToCartController, 
    updateCartItemController, 
    removeCartItemController, 
    clearCartController 
} from "../modules/cart/cart.controller";
import { requireAuth } from "../middlewares/auth.middleware";

const router = express.Router();

/**
 * @description Get current user's cart
 * @route GET /api/v1/cart
 * @access Private
 */
router.get("/", requireAuth(), getCartController);

/**
 * @description Add an item to the cart
 * @route POST /api/v1/cart
 * @access Private
 */
router.post("/", requireAuth(), addToCartController);

/**
 * @description Clear the entire cart
 * @route DELETE /api/v1/cart
 * @access Private
 */
router.delete("/", requireAuth(), clearCartController);

/**
 * @description Update the quantity of a cart item
 * @route PUT /api/v1/cart/:id
 * @access Private
 */
router.put("/:id", requireAuth(), updateCartItemController);

/**
 * @description Remove a single item from the cart
 * @route DELETE /api/v1/cart/:id
 * @access Private
 */
router.delete("/:id", requireAuth(), removeCartItemController);

export default router;

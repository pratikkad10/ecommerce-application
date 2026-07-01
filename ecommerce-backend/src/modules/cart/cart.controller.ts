import { Request, Response } from "express";
import { 
    getUserCart, 
    addToCart, 
    updateCartItem, 
    removeCartItem, 
    clearUserCart 
} from "../../services/cart.service";
import { addToCartSchema, updateCartItemSchema } from "../../validation/cart.validation";
import { getVariantById } from "../../services/variant.service";

/**
 * Get current user's cart
 * @route GET /api/v1/cart
 * @access Private
 */
export const getCartController = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const cartItems = await getUserCart(userId);
        
        // Calculate cart totals
        let cartTotal = 0;
        const formattedItems = cartItems.map(item => {
            // Price fallback logic: variant price takes precedence over base product price
            const price = Number(item.variant.price || item.variant.product.basePrice);
            const itemTotal = price * item.quantity;
            cartTotal += itemTotal;
            
            return {
                id: item.id,
                quantity: item.quantity,
                itemTotal,
                variant: item.variant
            };
        });

        return res.status(200).json({
            success: true,
            message: "Cart retrieved successfully",
            data: {
                items: formattedItems,
                summary: {
                    totalItems: cartItems.reduce((acc, item) => acc + item.quantity, 0),
                    cartTotal
                }
            }
        });
    } catch (error) {
        console.error("error fetching cart", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

/**
 * Add item to cart
 * @route POST /api/v1/cart
 * @access Private
 */
export const addToCartController = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const validation = addToCartSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: validation.error.format(),
            });
        }

        // Verify the variant actually exists
        const variant = await getVariantById(validation.data.variantId);
        if (!variant) {
            return res.status(404).json({ success: false, message: "Variant not found" });
        }

        // Check stock availability (basic check)
        if (variant.stock < validation.data.quantity) {
             return res.status(400).json({ success: false, message: "Insufficient stock available" });
        }

        const cartItem = await addToCart(userId, validation.data);

        return res.status(201).json({
            success: true,
            message: "Item added to cart successfully",
            data: cartItem,
        });
    } catch (error: any) {
        console.error("error adding to cart", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

/**
 * Update cart item quantity
 * @route PUT /api/v1/cart/:id
 * @access Private
 */
export const updateCartItemController = async (req: Request<{ id: string }>, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const { id } = req.params;
        const validation = updateCartItemSchema.safeParse(req.body);
        
        if (!validation.success) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: validation.error.format(),
            });
        }

        const updatedItem = await updateCartItem(id, userId, validation.data.quantity);
        if (!updatedItem) {
            return res.status(404).json({ success: false, message: "Cart item not found or unauthorized" });
        }

        return res.status(200).json({
            success: true,
            message: "Cart item updated successfully",
            data: updatedItem,
        });
    } catch (error: any) {
        console.error("error updating cart item", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

/**
 * Remove an item from the cart
 * @route DELETE /api/v1/cart/:id
 * @access Private
 */
export const removeCartItemController = async (req: Request<{ id: string }>, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const { id } = req.params;
        
        const deletedItem = await removeCartItem(id, userId);
        if (!deletedItem) {
            return res.status(404).json({ success: false, message: "Cart item not found or unauthorized" });
        }

        return res.status(200).json({
            success: true,
            message: "Cart item removed successfully",
        });
    } catch (error: any) {
        console.error("error removing cart item", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

/**
 * Clear the user's cart
 * @route DELETE /api/v1/cart
 * @access Private
 */
export const clearCartController = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        await clearUserCart(userId);

        return res.status(200).json({
            success: true,
            message: "Cart cleared successfully",
        });
    } catch (error: any) {
        console.error("error clearing cart", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

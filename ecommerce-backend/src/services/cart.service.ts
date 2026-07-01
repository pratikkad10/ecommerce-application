import { prisma } from "../config/prisma.config";
import { AddToCartInput, UpdateCartItemInput } from "../validation/cart.validation";

/**
 * Get all cart items for a user, heavily populated with product data for checkout/display
 */
export const getUserCart = async (userId: string) => {
    return await prisma.cart.findMany({
        where: { userId },
        include: {
            variant: {
                include: {
                    size: true,
                    color: true,
                    product: {
                        include: {
                            images: true
                        }
                    }
                }
            }
        },
        orderBy: { createdAt: 'asc' }
    });
};

/**
 * Add an item to the cart, or increment quantity if it already exists
 */
export const addToCart = async (userId: string, data: AddToCartInput) => {
    // We use upsert to either create a new cart entry or update the existing one
    return await prisma.cart.upsert({
        where: {
            userId_variantId: {
                userId,
                variantId: data.variantId
            }
        },
        update: {
            quantity: {
                increment: data.quantity
            }
        },
        create: {
            userId,
            variantId: data.variantId,
            quantity: data.quantity
        },
        include: {
            variant: {
                include: {
                    product: true
                }
            }
        }
    });
};

/**
 * Update the quantity of a specific cart item
 */
export const updateCartItem = async (cartItemId: string, userId: string, quantity: number) => {
    // Verify ownership implicitly by checking both ID and userId
    const cartItem = await prisma.cart.findFirst({
        where: { id: cartItemId, userId }
    });

    if (!cartItem) return null;

    return await prisma.cart.update({
        where: { id: cartItemId },
        data: { quantity }
    });
};

/**
 * Remove an item from the cart completely
 */
export const removeCartItem = async (cartItemId: string, userId: string) => {
    const cartItem = await prisma.cart.findFirst({
        where: { id: cartItemId, userId }
    });

    if (!cartItem) return null;

    return await prisma.cart.delete({
        where: { id: cartItemId }
    });
};

/**
 * Clear the entire cart for a user
 */
export const clearUserCart = async (userId: string) => {
    return await prisma.cart.deleteMany({
        where: { userId }
    });
};

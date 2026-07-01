import { prisma } from "../config/prisma.config";

/**
 * Get all wishlist items for a user, populated with product data
 */
export const getUserWishlist = async (userId: string) => {
    return await prisma.wishlist.findMany({
        where: { userId },
        include: {
            product: {
                include: {
                    images: true,
                    variants: {
                        include: {
                            size: true,
                            color: true
                        }
                    }
                }
            }
        },
        orderBy: { createdAt: 'desc' }
    });
};

/**
 * Add a product to the user's wishlist
 */
export const addToWishlist = async (userId: string, productId: string) => {
    // We use upsert so it doesn't throw if the item is already in the wishlist
    return await prisma.wishlist.upsert({
        where: {
            userId_productId: {
                userId,
                productId
            }
        },
        update: {}, // Do nothing if it exists
        create: {
            userId,
            productId
        },
        include: {
            product: {
                include: {
                    images: true
                }
            }
        }
    });
};

/**
 * Remove a product from the user's wishlist
 */
export const removeFromWishlist = async (userId: string, productId: string) => {
    const item = await prisma.wishlist.findUnique({
        where: {
            userId_productId: {
                userId,
                productId
            }
        }
    });

    if (!item) return null;

    return await prisma.wishlist.delete({
        where: {
            id: item.id
        }
    });
};

/**
 * Clear the entire wishlist for a user
 */
export const clearUserWishlist = async (userId: string) => {
    return await prisma.wishlist.deleteMany({
        where: { userId }
    });
};

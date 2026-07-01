import { prisma } from "../config/prisma.config";
import { CreateReviewInput, UpdateReviewInput } from "../validation/review.validation";
import { Prisma } from "../generated/prisma/client";

/**
 * Recalculates and updates the average rating and review count for a product
 */
const updateProductRating = async (productId: string) => {
    const aggregations = await prisma.review.aggregate({
        where: { productId },
        _avg: { rating: true },
        _count: { id: true }
    });

    const averageRating = aggregations._avg.rating ? Number(aggregations._avg.rating.toFixed(1)) : 0;
    const numReviews = aggregations._count.id;

    await prisma.product.update({
        where: { id: productId },
        data: { averageRating, numReviews }
    });
};

export const getProductReviews = async (productId: string) => {
    return await prisma.review.findMany({
        where: { productId },
        include: {
            user: {
                select: {
                    id: true,
                    firstName: true,
                    lastName: true
                }
            }
        },
        orderBy: { createdAt: 'desc' }
    });
};

export const createReview = async (userId: string, data: CreateReviewInput) => {
    const review = await prisma.review.upsert({
        where: {
            userId_productId: {
                userId,
                productId: data.productId
            }
        },
        update: {
            rating: data.rating,
            comment: data.comment || null
        },
        create: {
            userId,
            productId: data.productId,
            rating: data.rating,
            comment: data.comment || null
        }
    });

    await updateProductRating(data.productId);
    return review;
};

export const updateReview = async (id: string, userId: string, data: UpdateReviewInput) => {
    const review = await prisma.review.findFirst({
        where: { id, userId }
    });

    if (!review) return null;

    const updateData: Prisma.ReviewUncheckedUpdateInput = {};
    if (data.rating !== undefined) updateData.rating = data.rating;
    if (data.comment !== undefined) updateData.comment = data.comment;

    const updatedReview = await prisma.review.update({
        where: { id },
        data: updateData
    });

    await updateProductRating(updatedReview.productId);
    return updatedReview;
};

export const deleteReview = async (id: string, userId: string) => {
    const review = await prisma.review.findFirst({
        where: { id, userId }
    });

    if (!review) return null;

    await prisma.review.delete({
        where: { id }
    });

    await updateProductRating(review.productId);
    return review;
};

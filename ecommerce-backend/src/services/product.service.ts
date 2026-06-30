import { prisma } from "../config/prisma.config";

/**
 * Fetch a paginated list of products along with the total count.
 * @param skip - The number of records to skip
 * @param limit - The maximum number of records to return
 * @returns A tuple containing [products, totalCount]
 */
export const getPaginatedProducts = async (skip: number, limit: number) => {
    //Used promise.all to fetch products and total count in parallel for better performance
    return await Promise.all([
        prisma.product.findMany({
            skip,
            take: limit,
            orderBy: { createdAt: 'desc' },
        }),
        prisma.product.count(),
    ]);
};




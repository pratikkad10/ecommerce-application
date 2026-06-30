import { prisma } from "../config/prisma.config";
import { Prisma } from "../generated/prisma/client";
import { CreateProductInput, UpdateProductInput } from "../validation/product.validation";

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




/**
 * Fetch a single product by its ID along with its variants and images.
 * @param productId - The ID of the product to fetch
 * @returns The product with its variants and images, or null if not found
 */
export const getProductById = async (productId: string) => {
    return await prisma.product.findUnique({
        where: { id: productId },
        include: {
            variants: {
                include: {
                    size: true,
                    color: true,
                }
            },
            images: true
        }
    });
};


/**
 * Create a new product in the database.
 * @param data - The validated product data
 * @param slug - The generated unique slug
 * @returns The newly created product
 */
export const createNewProduct = async (data: CreateProductInput, slug: string) => {
    return await prisma.product.create({
        data: {
            ...data,
            slug,
        }
    });
};


/**
 * Update an existing product in the database.
 * @param productId - The ID of the product to update
 * @param data - The validated product data
 * @param slug - The generated unique slug
 * @returns The updated product
 */
export const updateExistingProduct = async (productId: string, data: UpdateProductInput, slug?: string) => {

    const updateData = {
        ...data,
        ...(slug && { slug })
    } as Prisma.ProductUpdateInput;

    return await prisma.product.update({
        where: { id: productId },
        data: updateData
    });
};

/**
 * Delete an existing product from the database.
 * @param productId - The ID of the product to delete
 * @returns The deleted product
 */
export const deleteExistingProduct = async (productId: string) => {
    return await prisma.product.delete({
        where: { id: productId },
    });
};
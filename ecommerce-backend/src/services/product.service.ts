import { cloudinary } from "../config/cloudinary.config";
import { prisma } from "../config/prisma.config";
import { Prisma } from "../generated/prisma/client";
import { CreateProductInput, UpdateProductInput, ProductQueryInput } from "../validation/product.validation";

/**
 * Fetch a paginated and filtered list of products along with the total count.
 * @param skip - The number of records to skip
 * @param limit - The maximum number of records to return
 * @param filters - The validated query parameters for search, filtering, and sorting
 * @returns A tuple containing [products, totalCount]
 */
export const getPaginatedProducts = async (skip: number, limit: number, filters: ProductQueryInput) => {
    // Build the dynamic WHERE clause
    const where: Prisma.ProductWhereInput = {
        isActive: true,
    };

    if (filters.search) {
        where.OR = [
            { name: { contains: filters.search, mode: 'insensitive' } },
            { description: { contains: filters.search, mode: 'insensitive' } }
        ];
    }

    if (filters.categoryId) where.categoryId = filters.categoryId;
    if (filters.brand) where.brand = filters.brand;
    if (filters.gender) where.gender = filters.gender;
    if (filters.isFeatured !== undefined) where.isFeatured = filters.isFeatured;

    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
        where.basePrice = {
            ...(filters.minPrice !== undefined && { gte: filters.minPrice }),
            ...(filters.maxPrice !== undefined && { lte: filters.maxPrice })
        };
    }

    // Build the dynamic ORDER BY clause
    let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: 'desc' };

    switch (filters.sort) {
        case 'price_asc':
            orderBy = { basePrice: 'asc' };
            break;
        case 'price_desc':
            orderBy = { basePrice: 'desc' };
            break;
        case 'rating':
            orderBy = { averageRating: 'desc' };
            break;
        case 'newest':
        default:
            orderBy = { createdAt: 'desc' };
            break;
    }

    // Execute in parallel for performance.
    return await Promise.all([
        prisma.product.findMany({
            where,
            skip,
            take: limit,
            orderBy,
            include: {
                category: true,
                images: true,
                variants: {
                    include: {
                        size: true,
                        color: true
                    }
                }
            }
        }),
        prisma.product.count({ where }),
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
            category: true,
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
    const images = await prisma.productImage.findMany({
        where: { productId },
        select: { publicId: true },
    });

    // delete all cloud assets (if any)
    const publicIds = images
        .map((img) => img.publicId)
        .filter((id): id is string => id !== null);

    if (publicIds.length > 0) {
        await cloudinary.api.delete_resources(publicIds);
    }

    return await prisma.product.delete({
        where: { id: productId },
    });
};
import { prisma } from "../config/prisma.config";
import { Prisma } from "../generated/prisma/client";
import { CreateVariantInput, UpdateVariantInput } from "../validation/variant.validation";

/**
 * Get all variants for a specific product
 * @param productId - The ID of the product
 * @returns List of variants
 */
export const getVariantsByProductId = async (productId: string) => {
    return await prisma.productVariant.findMany({
        where: { productId },
        include: {
            size: true,
            color: true,
        },
        orderBy: { createdAt: 'desc' }
    });
};

/**
 * Get a specific variant by ID
 * @param variantId - The ID of the variant
 * @returns The variant or null
 */
export const getVariantById = async (variantId: string) => {
    return await prisma.productVariant.findUnique({
        where: { id: variantId },
        include: {
            size: true,
            color: true,
        }
    });
};

/**
 * Create a new variant for a product
 * @param productId - The ID of the product
 * @param data - The validated variant data
 * @returns The newly created variant
 */
export const createNewVariant = async (productId: string, data: CreateVariantInput) => {
    const createData = { ...data, productId } as Prisma.ProductVariantUncheckedCreateInput;
    
    return await prisma.productVariant.create({
        data: createData
    });
};

/**
 * Update an existing variant
 * @param variantId - The ID of the variant to update
 * @param data - The validated update data
 * @returns The updated variant
 */
export const updateExistingVariant = async (variantId: string, data: UpdateVariantInput) => {
    const updateData = { ...data } as Prisma.ProductVariantUpdateInput;

    return await prisma.productVariant.update({
        where: { id: variantId },
        data: updateData
    });
};

/**
 * Delete an existing variant
 * @param variantId - The ID of the variant to delete
 * @returns The deleted variant
 */
export const deleteExistingVariant = async (variantId: string) => {
    return await prisma.productVariant.delete({
        where: { id: variantId }
    });
};

/**
 * Check if a variant with the same size and color already exists for a product
 * @param productId - The ID of the product
 * @param sizeId - The size ID (optional)
 * @param colorId - The color ID (optional)
 */
export const checkVariantExists = async (productId: string, sizeId?: string | null, colorId?: string | null) => {
    return await prisma.productVariant.findFirst({
        where: {
            productId,
            sizeId: sizeId || null,
            colorId: colorId || null
        }
    });
};

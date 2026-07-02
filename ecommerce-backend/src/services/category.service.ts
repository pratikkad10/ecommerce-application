import { prisma } from "../config/prisma.config";
import { CreateCategoryInput, UpdateCategoryInput } from "../validation/category.validation";
import { generateSlug } from "../utils/slug.utils";

/**
 * @description Get all categories
 * @returns Array of categories
 */
export const getAllCategories = async () => {
    return await prisma.category.findMany({
        orderBy: { name: 'asc' }
    });
};

/**
 * @description Create a new category
 * @param data - The validated create data
 * @returns The created category
 */
export const createCategory = async (data: CreateCategoryInput) => {
    const slug = generateSlug(data.name);

    const createData: any = {
        name: data.name,
        slug
    };

    if (data.description !== undefined) {
        createData.description = data.description;
    }

    if (data.image !== undefined) {
        createData.image = data.image;
    }

    return await prisma.category.create({
        data: createData
    });
};

/**
 * @description Update an existing category
 * @param id - The ID of the category to update
 * @param data - The validated update data
 * @returns The updated category
 */
export const updateCategory = async (id: string, data: UpdateCategoryInput) => {
    const updateData: any = {};
    
    if (data.name !== undefined) {
        updateData.name = data.name;
        updateData.slug = generateSlug(data.name);
    }
    
    if (data.description !== undefined) {
        updateData.description = data.description;
    }

    if (data.image !== undefined) {
        updateData.image = data.image;
    }

    return await prisma.category.update({
        where: { id },
        data: updateData
    });
};

/**
 * @description Delete a category
 * @param id - The ID of the category to delete
 * @returns The deleted category
 */
export const deleteCategory = async (id: string) => {
    return await prisma.category.delete({
        where: { id }
    });
};

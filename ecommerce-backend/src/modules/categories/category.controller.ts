import { Request, Response } from "express";
import { 
    getAllCategories, 
    createCategory, 
    updateCategory, 
    deleteCategory 
} from "../../services/category.service";
import { createCategorySchema, updateCategorySchema } from "../../validation/category.validation";

/**
 * @description Get all categories
 * @param req - express request object
 * @param res - express response object
 * @returns JSON response with categories array
 */
export const getCategoriesController = async (req: Request, res: Response) => {
    try {
        const categories = await getAllCategories();
        return res.status(200).json({
            success: true,
            data: categories
        });
    } catch (error) {
        console.error("error fetching categories", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

/**
 * @description Create a new category
 * @param req - express request containing category data in body
 * @param res - express response object
 * @returns JSON response with created category
 */
export const createCategoryController = async (req: Request, res: Response) => {
    try {
        const validation = createCategorySchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: validation.error.format(),
            });
        }

        const category = await createCategory(validation.data);

        return res.status(201).json({
            success: true,
            message: "Category created successfully",
            data: category
        });
    } catch (error: any) {
        console.error("error creating category", error);
        if (error.code === 'P2002') {
            return res.status(409).json({ success: false, message: "A category with this name already exists" });
        }
        return res.status(500).json({ error: "Internal server error" });
    }
};

/**
 * @description Update a category
 * @param req - express request containing category id in params and data in body
 * @param res - express response object
 * @returns JSON response with updated category
 */
export const updateCategoryController = async (req: Request<{ id: string }>, res: Response) => {
    try {
        const { id } = req.params;
        const validation = updateCategorySchema.safeParse(req.body);
        
        if (!validation.success) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: validation.error.format(),
            });
        }

        const category = await updateCategory(id, validation.data);

        return res.status(200).json({
            success: true,
            message: "Category updated successfully",
            data: category
        });
    } catch (error: any) {
        console.error("error updating category", error);
        if (error.code === 'P2025') {
            return res.status(404).json({ success: false, message: "Category not found" });
        }
        if (error.code === 'P2002') {
            return res.status(409).json({ success: false, message: "A category with this name already exists" });
        }
        return res.status(500).json({ error: "Internal server error" });
    }
};

/**
 * @description Delete a category
 * @param req - express request containing category id in params
 * @param res - express response object
 * @returns JSON response confirming deletion
 */
export const deleteCategoryController = async (req: Request<{ id: string }>, res: Response) => {
    try {
        const { id } = req.params;
        
        await deleteCategory(id);

        return res.status(200).json({
            success: true,
            message: "Category deleted successfully"
        });
    } catch (error: any) {
        console.error("error deleting category", error);
        if (error.code === 'P2025') {
            return res.status(404).json({ success: false, message: "Category not found" });
        }
        return res.status(500).json({ error: "Internal server error" });
    }
};

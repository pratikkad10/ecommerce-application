import { Request, Response } from "express";
import { getAllSizes, createSize, updateSize, deleteSize } from "../../services/attribute.service";
import { createSizeSchema, updateSizeSchema } from "../../validation/attribute.validation";

export const getSizesController = async (req: Request, res: Response) => {
    try {
        const sizes = await getAllSizes();
        return res.status(200).json({
            success: true,
            message: "Sizes retrieved successfully",
            data: sizes,
        });
    } catch (error) {
        console.error("error fetching sizes", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

export const createSizeController = async (req: Request, res: Response) => {
    try {
        const validation = createSizeSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: validation.error.format(),
            });
        }

        const size = await createSize(validation.data);
        return res.status(201).json({
            success: true,
            message: "Size created successfully",
            data: size,
        });
    } catch (error: any) {
        console.error("error creating size", error);
        if (error.code === 'P2002') {
             return res.status(409).json({ success: false, message: "A size with this name already exists" });
        }
        return res.status(500).json({ error: "Internal server error" });
    }
};

export const updateSizeController = async (req: Request<{ id: string }>, res: Response) => {
    try {
        const { id } = req.params;
        const validation = updateSizeSchema.safeParse(req.body);
        
        if (!validation.success) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: validation.error.format(),
            });
        }

        const size = await updateSize(id, validation.data);
        return res.status(200).json({
            success: true,
            message: "Size updated successfully",
            data: size,
        });
    } catch (error: any) {
        console.error("error updating size", error);
        if (error.code === 'P2025') {
            return res.status(404).json({ success: false, message: "Size not found" });
        }
        if (error.code === 'P2002') {
             return res.status(409).json({ success: false, message: "A size with this name already exists" });
        }
        return res.status(500).json({ error: "Internal server error" });
    }
};

export const deleteSizeController = async (req: Request<{ id: string }>, res: Response) => {
    try {
        const { id } = req.params;
        const size = await deleteSize(id);
        
        return res.status(200).json({
            success: true,
            message: "Size deleted successfully",
            data: size,
        });
    } catch (error: any) {
        console.error("error deleting size", error);
        if (error.code === 'P2025') {
            return res.status(404).json({ success: false, message: "Size not found" });
        }
        return res.status(500).json({ error: "Internal server error" });
    }
};

import { Request, Response } from "express";
import { getAllColors, createColor, updateColor, deleteColor } from "../../services/attribute.service";
import { createColorSchema, updateColorSchema } from "../../validation/attribute.validation";

export const getColorsController = async (req: Request, res: Response) => {
    try {
        const colors = await getAllColors();
        return res.status(200).json({
            success: true,
            message: "Colors retrieved successfully",
            data: colors,
        });
    } catch (error) {
        console.error("error fetching colors", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

export const createColorController = async (req: Request, res: Response) => {
    try {
        const validation = createColorSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: validation.error.format(),
            });
        }

        const color = await createColor(validation.data);
        return res.status(201).json({
            success: true,
            message: "Color created successfully",
            data: color,
        });
    } catch (error: any) {
        console.error("error creating color", error);
        if (error.code === 'P2002') {
             return res.status(409).json({ success: false, message: "A color with this name already exists" });
        }
        return res.status(500).json({ error: "Internal server error" });
    }
};

export const updateColorController = async (req: Request<{ id: string }>, res: Response) => {
    try {
        const { id } = req.params;
        const validation = updateColorSchema.safeParse(req.body);
        
        if (!validation.success) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: validation.error.format(),
            });
        }

        const color = await updateColor(id, validation.data);
        return res.status(200).json({
            success: true,
            message: "Color updated successfully",
            data: color,
        });
    } catch (error: any) {
        console.error("error updating color", error);
        if (error.code === 'P2025') {
            return res.status(404).json({ success: false, message: "Color not found" });
        }
        if (error.code === 'P2002') {
             return res.status(409).json({ success: false, message: "A color with this name already exists" });
        }
        return res.status(500).json({ error: "Internal server error" });
    }
};

export const deleteColorController = async (req: Request<{ id: string }>, res: Response) => {
    try {
        const { id } = req.params;
        const color = await deleteColor(id);
        
        return res.status(200).json({
            success: true,
            message: "Color deleted successfully",
            data: color,
        });
    } catch (error: any) {
        console.error("error deleting color", error);
        if (error.code === 'P2025') {
            return res.status(404).json({ success: false, message: "Color not found" });
        }
        return res.status(500).json({ error: "Internal server error" });
    }
};

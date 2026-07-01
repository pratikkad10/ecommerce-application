import { Request, Response } from "express";
import { 
    getProductReviews, 
    createReview, 
    updateReview, 
    deleteReview 
} from "../../services/review.service";
import { createReviewSchema, updateReviewSchema } from "../../validation/review.validation";

export const getReviewsController = async (req: Request<{ productId: string }>, res: Response) => {
    try {
        const { productId } = req.params;
        if (!productId) {
            return res.status(400).json({ success: false, message: "Product ID is required" });
        }

        const reviews = await getProductReviews(productId);
        
        return res.status(200).json({
            success: true,
            data: reviews
        });
    } catch (error) {
        console.error("error fetching reviews", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

export const createReviewController = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const validation = createReviewSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: validation.error.format(),
            });
        }

        const review = await createReview(userId, validation.data);

        return res.status(201).json({
            success: true,
            message: "Review submitted successfully",
            data: review
        });
    } catch (error: any) {
        console.error("error creating review", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

export const updateReviewController = async (req: Request<{ id: string }>, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const { id } = req.params;
        const validation = updateReviewSchema.safeParse(req.body);
        
        if (!validation.success) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: validation.error.format(),
            });
        }

        const review = await updateReview(id, userId, validation.data);
        if (!review) {
            return res.status(404).json({ success: false, message: "Review not found or unauthorized" });
        }

        return res.status(200).json({
            success: true,
            message: "Review updated successfully",
            data: review
        });
    } catch (error: any) {
        console.error("error updating review", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

export const deleteReviewController = async (req: Request<{ id: string }>, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const { id } = req.params;
        
        const review = await deleteReview(id, userId);
        if (!review) {
            return res.status(404).json({ success: false, message: "Review not found or unauthorized" });
        }

        return res.status(200).json({
            success: true,
            message: "Review deleted successfully"
        });
    } catch (error: any) {
        console.error("error deleting review", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

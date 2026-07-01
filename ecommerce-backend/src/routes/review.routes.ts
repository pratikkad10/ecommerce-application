import express from "express";
import { 
    getReviewsController, 
    createReviewController, 
    updateReviewController, 
    deleteReviewController 
} from "../modules/reviews/review.controller";
import { requireAuth } from "../middlewares/auth.middleware";

const router = express.Router();

/**
 * @route GET /api/v1/reviews/product/:productId
 * @access Public
 */
router.get("/product/:productId", getReviewsController);

/**
 * @route POST /api/v1/reviews
 * @access Private
 */
router.post("/", requireAuth(), createReviewController);

/**
 * @route PUT /api/v1/reviews/:id
 * @access Private
 */
router.put("/:id", requireAuth(), updateReviewController);

/**
 * @route DELETE /api/v1/reviews/:id
 * @access Private
 */
router.delete("/:id", requireAuth(), deleteReviewController);

export default router;

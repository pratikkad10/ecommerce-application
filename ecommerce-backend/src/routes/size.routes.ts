import express from "express";
import { 
    getSizesController, 
    createSizeController, 
    updateSizeController, 
    deleteSizeController 
} from "../modules/attributes/size.controller";
import { requireAuth } from "../middlewares/auth.middleware";

const router = express.Router();

/**
 * @description Get all sizes
 * @route GET /api/v1/sizes
 * @access Public
 */
router.get("/", getSizesController);

/**
 * @description Create a new size
 * @route POST /api/v1/sizes
 * @access Private (Admin only)
 */
router.post("/", requireAuth(["ADMIN"]), createSizeController);

/**
 * @description Update a size
 * @route PUT /api/v1/sizes/:id
 * @access Private (Admin only)
 */
router.put("/:id", requireAuth(["ADMIN"]), updateSizeController);

/**
 * @description Delete a size
 * @route DELETE /api/v1/sizes/:id
 * @access Private (Admin only)
 */
router.delete("/:id", requireAuth(["ADMIN"]), deleteSizeController);

export default router;

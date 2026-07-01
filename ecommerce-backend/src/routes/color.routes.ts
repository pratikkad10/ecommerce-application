import express from "express";
import { 
    getColorsController, 
    createColorController, 
    updateColorController, 
    deleteColorController 
} from "../modules/attributes/color.controller";
import { requireAuth } from "../middlewares/auth.middleware";

const router = express.Router();

/**
 * @description Get all colors
 * @route GET /api/v1/colors
 * @access Public
 */
router.get("/", getColorsController);

/**
 * @description Create a new color
 * @route POST /api/v1/colors
 * @access Private (Admin only)
 */
router.post("/", requireAuth(["ADMIN"]), createColorController);

/**
 * @description Update a color
 * @route PUT /api/v1/colors/:id
 * @access Private (Admin only)
 */
router.put("/:id", requireAuth(["ADMIN"]), updateColorController);

/**
 * @description Delete a color
 * @route DELETE /api/v1/colors/:id
 * @access Private (Admin only)
 */
router.delete("/:id", requireAuth(["ADMIN"]), deleteColorController);

export default router;

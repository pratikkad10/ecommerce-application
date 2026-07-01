import express from "express";
import { 
    getCategoriesController, 
    createCategoryController, 
    updateCategoryController, 
    deleteCategoryController 
} from "../modules/categories/category.controller";
import { requireAuth } from "../middlewares/auth.middleware";

const router = express.Router();

/**
 * @route GET /api/v1/categories
 * @access Public
 */
router.get("/", getCategoriesController);

/**
 * @route POST /api/v1/categories
 * @access Private (Admin only)
 */
router.post("/", requireAuth(["ADMIN"]), createCategoryController);

/**
 * @route PUT /api/v1/categories/:id
 * @access Private (Admin only)
 */
router.put("/:id", requireAuth(["ADMIN"]), updateCategoryController);

/**
 * @route DELETE /api/v1/categories/:id
 * @access Private (Admin only)
 */
router.delete("/:id", requireAuth(["ADMIN"]), deleteCategoryController);

export default router;

import express from "express";
import { 
    getDashboardStatsController, 
    getAllOrdersAdminController, 
    updateOrderStatusAdminController, 
    getAllUsersAdminController, 
    updateUserAdminController 
} from "../modules/admin/admin.controller";
import { requireAuth } from "../middlewares/auth.middleware";

const router = express.Router();

// ALL routes in this file require ADMIN privileges
const adminAuth = requireAuth(["ADMIN"]);

/**
 * @route GET /api/v1/admin/dashboard
 */
router.get("/dashboard", adminAuth, getDashboardStatsController);

/**
 * @route GET /api/v1/admin/orders
 */
router.get("/orders", adminAuth, getAllOrdersAdminController);

/**
 * @route PUT /api/v1/admin/orders/:id/status
 */
router.put("/orders/:id/status", adminAuth, updateOrderStatusAdminController);

/**
 * @route GET /api/v1/admin/users
 */
router.get("/users", adminAuth, getAllUsersAdminController);

/**
 * @route PUT /api/v1/admin/users/:id
 */
router.put("/users/:id", adminAuth, updateUserAdminController);

export default router;

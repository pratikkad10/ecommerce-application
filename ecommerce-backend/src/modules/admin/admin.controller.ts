import { Request, Response } from "express";
import { getPaginationParams } from "../../utils/pagination.utils";
import { 
    getDashboardStats, 
    getAllOrdersAdmin, 
    updateOrderStatusAdmin, 
    getAllUsersAdmin, 
    updateUserAdmin 
} from "../../services/admin.service";
import { updateOrderStatusSchema, updateUserStatusSchema } from "../../validation/admin.validation";

/**
 * Get overall dashboard analytics
 * @route GET /api/v1/admin/dashboard
 * @access Private (Admin only)
 */
export const getDashboardStatsController = async (req: Request, res: Response) => {
    try {
        const stats = await getDashboardStats();
        return res.status(200).json({
            success: true,
            data: stats
        });
    } catch (error) {
        console.error("error fetching admin dashboard stats", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

/**
 * Get all orders (paginated)
 * @route GET /api/v1/admin/orders
 * @access Private (Admin only)
 */
export const getAllOrdersAdminController = async (req: Request, res: Response) => {
    try {
        const { page, limit } = getPaginationParams(req);

        const result = await getAllOrdersAdmin(page, limit);
        return res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        console.error("error fetching all orders", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

/**
 * Update an order's status (e.g., mark as SHIPPED)
 * @route PUT /api/v1/admin/orders/:id/status
 * @access Private (Admin only)
 */
export const updateOrderStatusAdminController = async (req: Request<{ id: string }>, res: Response) => {
    try {
        const { id } = req.params;
        
        const validation = updateOrderStatusSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: validation.error.format(),
            });
        }

        const updatedOrder = await updateOrderStatusAdmin(id, validation.data);

        return res.status(200).json({
            success: true,
            message: "Order status updated successfully",
            data: updatedOrder
        });
    } catch (error) {
        console.error("error updating order status", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

/**
 * Get all users (paginated)
 * @route GET /api/v1/admin/users
 * @access Private (Admin only)
 */
export const getAllUsersAdminController = async (req: Request, res: Response) => {
    try {
        const { page, limit } = getPaginationParams(req);

        const result = await getAllUsersAdmin(page, limit);
        return res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        console.error("error fetching all users", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

/**
 * Update a user's status or role (e.g., Ban user or Promote to Admin)
 * @route PUT /api/v1/admin/users/:id
 * @access Private (Admin only)
 */
export const updateUserAdminController = async (req: Request<{ id: string }>, res: Response) => {
    try {
        const { id } = req.params;

        // Prevent admin from deactivating themselves
        if (req.user?.id === id) {
            return res.status(403).json({ success: false, message: "You cannot modify your own account status" });
        }
        
        const validation = updateUserStatusSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: validation.error.format(),
            });
        }

        const updatedUser = await updateUserAdmin(id, validation.data);

        return res.status(200).json({
            success: true,
            message: "User updated successfully",
            data: {
                id: updatedUser.id,
                email: updatedUser.email,
                role: updatedUser.role,
                isActive: updatedUser.isActive
            }
        });
    } catch (error) {
        console.error("error updating user", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

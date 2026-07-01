import { Request, Response } from "express";
import { 
    initializeCheckout, 
    verifyAndFulfillOrder, 
    getUserOrders 
} from "../../services/order.service";
import { checkoutSchema, verifyPaymentSchema } from "../../validation/order.validation";

/**
 * Initialize checkout and get Razorpay Order ID
 * @route POST /api/v1/orders/checkout
 * @access Private
 */
export const checkoutController = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const validation = checkoutSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: validation.error.format(),
            });
        }

        const checkoutData = await initializeCheckout(userId, validation.data);

        return res.status(200).json({
            success: true,
            message: "Checkout initialized",
            data: checkoutData
        });
    } catch (error: any) {
        console.error("error during checkout", error);
        if (error.message === "Cart is empty") {
            return res.status(400).json({ success: false, message: error.message });
        }
        return res.status(500).json({ error: "Internal server error" });
    }
};

/**
 * Verify Razorpay payment and fulfill order
 * @route POST /api/v1/orders/verify
 * @access Private
 */
export const verifyPaymentController = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const validation = verifyPaymentSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: validation.error.format(),
            });
        }

        const result = await verifyAndFulfillOrder(userId, validation.data);

        return res.status(200).json({
            success: true,
            message: "Payment verified and order fulfilled successfully",
            data: result
        });
    } catch (error: any) {
        console.error("error verifying payment", error);
        if (error.message === "Invalid payment signature" || error.message === "Order not found") {
            return res.status(400).json({ success: false, message: error.message });
        }
        return res.status(500).json({ error: "Internal server error" });
    }
};

/**
 * Get all orders for the current user
 * @route GET /api/v1/orders
 * @access Private
 */
export const getUserOrdersController = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const orders = await getUserOrders(userId);

        return res.status(200).json({
            success: true,
            message: "Orders retrieved successfully",
            data: orders
        });
    } catch (error) {
        console.error("error fetching orders", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

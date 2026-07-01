import express from "express";
import { 
    checkoutController, 
    verifyPaymentController, 
    getUserOrdersController 
} from "../modules/orders/order.controller";
import { requireAuth } from "../middlewares/auth.middleware";

const router = express.Router();

/**
 * @description Initialize checkout and get Razorpay Order ID
 * @route POST /api/v1/orders/checkout
 * @access Private
 */
router.post("/checkout", requireAuth(), checkoutController);

/**
 * @description Verify Razorpay payment and fulfill order
 * @route POST /api/v1/orders/verify
 * @access Private
 */
router.post("/verify", requireAuth(), verifyPaymentController);

/**
 * @description Get all orders for the logged-in user
 * @route GET /api/v1/orders
 * @access Private
 */
router.get("/", requireAuth(), getUserOrdersController);

export default router;

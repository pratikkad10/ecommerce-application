import { prisma } from "../config/prisma.config";
import { Prisma } from "../generated/prisma/client";
import { CheckoutInput, VerifyPaymentInput } from "../validation/order.validation";
import { getUserCart, clearUserCart } from "./cart.service";
import { razorpayInstance } from "../config/razorpay.config";
import crypto from "crypto";

const generateOrderNumber = () => {
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `ORD-${timestamp}-${random}`;
};

/**
 * Initialize checkout: calculate cart, create pending DB order, and create Razorpay order
 */
export const initializeCheckout = async (userId: string, data: CheckoutInput) => {
    // Fetch user's cart
    const cartItems = await getUserCart(userId);
    if (cartItems.length === 0) {
        throw new Error("Cart is empty");
    }

    // Calculate Total Amount
    let totalAmount = 0;
    const orderItemsData: Prisma.OrderItemUncheckedCreateWithoutOrderInput[] = cartItems.map(item => {
        const unitPrice = Number(item.variant.price || item.variant.product.basePrice);
        totalAmount += (unitPrice * item.quantity);

        return {
            variantId: item.variantId,
            quantity: item.quantity,
            unitPrice,
            productName: item.variant.product.name,
            variantSku: item.variant.sku,
            sizeName: item.variant.size?.name || null,
            colorName: item.variant.color?.name || null
        };
    });

    // Create Razorpay Order
    // Razorpay amount is in the smallest currency sub-unit (paise). Multiply by 100.
    const amountInPaise = Math.round(totalAmount * 100);

    // Razorpay receipt has a strict max length of 40 characters
    const safeReceipt = `rcpt_${userId.slice(0, 8)}_${Date.now()}`.slice(0, 40);

    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_SECRET) {
        throw new Error("Razorpay credentials (RAZORPAY_KEY_ID / RAZORPAY_SECRET) are not configured on the server.");
    }

    const razorpayOrder = await razorpayInstance.orders.create({
        amount: amountInPaise,
        currency: "INR",
        receipt: safeReceipt
    });

    // Create Prisma Order (PENDING state)
    const newOrder = await prisma.order.create({
        data: {
            orderNumber: generateOrderNumber(),
            totalAmount,
            userId,
            shippingStreet: data.shippingStreet,
            shippingCity: data.shippingCity,
            shippingState: data.shippingState,
            shippingCountry: data.shippingCountry,
            shippingPostalCode: data.shippingZip, // Mapped from Zip
            transactionId: razorpayOrder.id, // Store razorpay_order_id
            paymentMethod: "RAZORPAY",
            items: {
                create: orderItemsData
            }
        }
    });

    return {
        order: newOrder,
        razorpayOrderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency
    };
};

/**
 * Verify Razorpay payment signature and fulfill order
 */
export const verifyAndFulfillOrder = async (userId: string, data: VerifyPaymentInput) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = data;

    // Verify HMAC-SHA256 Signature
    const secret = process.env.RAZORPAY_SECRET || "";
    if (!secret) {
        throw new Error("RAZORPAY_SECRET is not configured on the server");
    }

    const generated_signature = crypto
        .createHmac("sha256", secret)
        .update(razorpay_order_id + "|" + razorpay_payment_id)
        .digest("hex");

    if (generated_signature !== razorpay_signature) {
        throw new Error("Invalid payment signature");
    }

    // Find Order
    const order = await prisma.order.findFirst({
        where: { transactionId: razorpay_order_id, userId },
        include: { items: true }
    });

    if (!order) {
        throw new Error("Order not found");
    }

    // Fulfill: Update Order Status, Decrement Stock, Clear Cart
    await prisma.$transaction(async (tx) => {
        // Mark Order Paid
        await tx.order.update({
            where: { id: order.id },
            data: {
                paymentStatus: "PAID",
                status: "PROCESSING",
                transactionId: `${razorpay_order_id}_${razorpay_payment_id}`
            }
        });

        // Decrement Inventory Stock
        for (const item of order.items) {
            await tx.productVariant.update({
                where: { id: item.variantId },
                data: {
                    stock: {
                        decrement: item.quantity
                    }
                }
            });
        }
    });

    // Clear user's cart
    await clearUserCart(userId);

    return { success: true, orderId: order.id };
};

/**
 * Get all orders for a user
 */
export const getUserOrders = async (userId: string) => {
    return await prisma.order.findMany({
        where: { userId },
        include: {
            items: {
                include: {
                    variant: {
                        include: {
                            product: {
                                include: { images: true }
                            },
                            size: true,
                            color: true
                        }
                    }
                }
            }
        },
        orderBy: { createdAt: 'desc' }
    });
};

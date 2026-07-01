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
    // Razorpay amount is in the smallest currency sub-unit (paise/cents). Multiply by 100.
    const amountInPaise = Math.round(totalAmount * 100);

    const razorpayOrder = await razorpayInstance.orders.create({
        amount: amountInPaise,
        currency: "INR",
        receipt: `receipt_${userId}_${Date.now()}`
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
            transactionId: razorpayOrder.id, // Store razorpay_order_id here initially
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

    // Verify Signature
    const secret = process.env.RAZORPAY_SECRET || "";
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
    // Using an interactive transaction to ensure atomicity
    await prisma.$transaction(async (tx) => {
        // Mark Order Paid
        await tx.order.update({
            where: { id: order.id },
            data: {
                paymentStatus: "PAID",
                status: "PROCESSING",
                // Optionally store payment_id along with order_id
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

    // Clear user's cart (no need to be strictly in the same transaction)
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

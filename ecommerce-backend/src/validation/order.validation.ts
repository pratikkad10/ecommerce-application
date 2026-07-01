import { z } from "zod";

export const checkoutSchema = z.object({
    shippingStreet: z.string().min(1, "Street address is required"),
    shippingCity: z.string().min(1, "City is required"),
    shippingState: z.string().min(1, "State is required"),
    shippingCountry: z.string().min(1, "Country is required"),
    shippingZip: z.string().min(1, "Zip/Postal code is required"),
    contactPhone: z.string().min(1, "Contact phone is required"),
});

export const verifyPaymentSchema = z.object({
    razorpay_order_id: z.string().min(1, "Razorpay Order ID is required"),
    razorpay_payment_id: z.string().min(1, "Razorpay Payment ID is required"),
    razorpay_signature: z.string().min(1, "Razorpay Signature is required"),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;
export type VerifyPaymentInput = z.infer<typeof verifyPaymentSchema>;

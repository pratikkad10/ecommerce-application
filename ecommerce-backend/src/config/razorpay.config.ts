import Razorpay from "razorpay";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_SECRET) {
    console.error("RAZORPAY_KEY_ID or RAZORPAY_SECRET is missing in environment variables.");
}

export const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || "",
    key_secret: process.env.RAZORPAY_SECRET || "",
});

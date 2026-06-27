import nodemailer from "nodemailer";
import { getVerificationEmailTemplate } from "../templates/account-security.template";

// Create a reusable transporter object using SMTP transport
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.example.com",
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

/**
 * Send an email verification link to a user
 * @param customerName - The user's first name
 * @param to - The recipient's email address
 * @param verificationLink - The full URL link for verification
 */
export const sendVerificationEmail = async (customerName: string, to: string, verificationLink: string) => {
    try {
        const info = await transporter.sendMail({
            from: `"Kraya" <${process.env.SMTP_USER}>`,
            to,
            subject: "Verify your email address - Kraya",
            text: `Hi ${customerName}, verify your email address for Kraya. Please verify your email by clicking the following link (valid for 2 hours): ${verificationLink}`,
            html: getVerificationEmailTemplate(customerName, verificationLink),
        });

        console.log("Message sent: %s", info.messageId);
        return info;
    } catch (error) {
        console.error("Error sending verification email: ", error);
        throw new Error("Failed to send verification email");
    }
};

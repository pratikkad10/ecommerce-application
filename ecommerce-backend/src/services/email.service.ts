import { transporter } from "../config/email.config";
import { getVerificationEmailTemplate, getPasswordResetTemplate } from "../templates/account-security.template";

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

/**
 * Send a password reset link to a user
 * @param customerName - The user's first name
 * @param to - The recipient's email address
 * @param resetLink - The full URL link for resetting the password
 */
export const sendPasswordResetEmail = async (customerName: string, to: string, resetLink: string) => {
    try {
        const info = await transporter.sendMail({
            from: `"Kraya" <${process.env.SMTP_USER}>`,
            to,
            subject: "Reset your password - Kraya",
            text: `Hi ${customerName}, reset your Kraya password by clicking the following link (valid for 15 minutes): ${resetLink}`,
            html: getPasswordResetTemplate(customerName, resetLink),
        });

        console.log("Message sent: %s", info.messageId);
        return info;
    } catch (error) {
        console.error("Error sending password reset email: ", error);
        throw new Error("Failed to send password reset email");
    }
};

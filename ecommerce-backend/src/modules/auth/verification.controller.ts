import type { Request, Response } from "express";
import { updateEmailSchema } from "../../validation/user.validation";
import { generateAndSaveToken, verifyToken } from "../../services/token.service";
import { findUserByEmail, updateUser, findUserById } from "../../services/user.service";
import { sendVerificationEmail } from "../../services/email.service";
import dotenv from "dotenv";
dotenv.config();

/**
 * Verifies the user's email address using the token provided in the query parameters
 * @param req - The request object containing the token in query parameters
 * @param res - The response object
 * @returns A success message if the email is verified successfully, otherwise an error response
 */
export const verifyUserEmailController = async (req: Request, res: Response) => {
    try {
        const token = req.query.token as string;
        if (!token) {
            return res.status(400).json({ message: "Token is required" });
        }

        const userId = await verifyToken(token, "EMAIL_VERIFICATION");
        if (!userId) {
            return res.status(401).json({ message: "Invalid or expired token" });
        }

        // Update the user's verification status using the reusable service
        await updateUser(userId, { isEmailVerified: true });

        res.status(200).json({ message: "Email verified successfully" });
    } catch (error) {
        console.log("Error in user email verification: ", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

/**
 * Resends the email verification token to the user
 * @param req - The request object containing the email address
 * @param res - The response object
 * @returns A success message if the verification email is sent successfully, otherwise an error response
 */
export const resendVerificationEmailController = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        const user = await findUserByEmail(email);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.isEmailVerified) {
            return res.status(400).json({ message: "User is already verified" });
        }

        const verificationToken = await generateAndSaveToken(user.id, "EMAIL_VERIFICATION", 2);

        const emailLink = `${process.env.CLIENT_URL!}/verify-email-token?token=${verificationToken}`;

        console.log("Verification email link: ", emailLink, "Verification token: ", verificationToken);

        await sendVerificationEmail(user.firstName, user.email, emailLink);

        res.status(200).json({ message: "Verification email sent successfully" });
    } catch (error) {
        console.log("Error in resending verification email: ", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const updateEmailController = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const validation = updateEmailSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({ errors: validation.error.issues });
        }

        const { email } = validation.data;

        // Find the user in the database to get their current email
        const user = await findUserById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if the new email is the same as the current email
        if (user.email === email) {
            return res.status(400).json({ message: "New email is the same as the current email" });
        }

        // Check if the new email is already in use by another user
        const existingUser = await findUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: "Email is already in use by another user" });
        }

        // Update the user's email
        await updateUser(userId, { email, isEmailVerified: false });

        // Send verification email to the new email address
        const verificationToken = await generateAndSaveToken(userId, "EMAIL_VERIFICATION", 2);

        // Strictly using env variable as requested
        const emailLink = `${process.env.CLIENT_URL!}/verify-email-token?token=${verificationToken}`;

        await sendVerificationEmail(user.firstName, email, emailLink);

        res.status(200).json({ message: "Email updated successfully. Verification email sent to the new email address." });
    } catch (error) {
        console.log("Error in update email: ", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

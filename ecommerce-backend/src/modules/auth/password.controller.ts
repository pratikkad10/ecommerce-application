import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import { updatePasswordSchema } from "../../validation/user.validation";
import { generateAndSaveToken, verifyToken } from "../../services/token.service";
import { findUserByEmail, updateUser, findUserById } from "../../services/user.service";
import { sendPasswordResetEmail } from "../../services/email.service";

export const forgotPasswordController = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        const user = await findUserByEmail(email);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (!user.isEmailVerified) {
            return res.status(401).json({ message: "User not verified" });
        }

        const verificationToken = await generateAndSaveToken(user.id, "PASSWORD_RESET", 2);

        const emailLink = `${process.env.CLIENT_URL!}/reset-password?token=${verificationToken}`;

        console.log("Password reset email link: ", emailLink, "Password reset token: ", verificationToken);

        await sendPasswordResetEmail(user.firstName, user.email, emailLink);

        res.status(200).json({ message: "Password reset email sent successfully" });
    } catch (error) {
        console.log("Error in forgot password: ", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const resetPasswordController = async (req: Request, res: Response) => {
    try {
        const token = req.query.token as string;
        if (!token) {
            return res.status(400).json({ message: "Token is required" });
        }

        // Validate body FIRST (cheap check, no DB call)
        const { password, confirmPassword } = req.body;
        if (!password || !confirmPassword) {
            return res.status(400).json({ message: "Both password and confirm password are required" });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }

        // Only hit the database if the body is valid
        const userId = await verifyToken(token, "PASSWORD_RESET");
        if (!userId) {
            return res.status(401).json({ message: "Invalid or expired token" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await updateUser(userId, { passwordHash: hashedPassword });

        res.status(200).json({ message: "Password reset successful" });
    } catch (error) {
        console.log("Error in password reset: ", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const updatePasswordController = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const validation = updatePasswordSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({ errors: validation.error.issues });
        }

        const { oldPassword, newPassword } = validation.data;

        // Find the user in the database to get their current password hash
        const user = await findUserById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Verify that they typed their current password correctly
        const isOldPasswordValid = await bcrypt.compare(oldPassword, user.passwordHash);
        if (!isOldPasswordValid) {
            return res.status(401).json({ message: "Incorrect old password" });
        }

        // Hash the new password and save it
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await updateUser(userId, { passwordHash: hashedPassword });

        res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
        console.log("Error in update password: ", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

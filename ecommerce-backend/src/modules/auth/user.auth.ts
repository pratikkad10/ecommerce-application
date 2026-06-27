import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import { userLoginSchema, userRegisterSchema, updatePasswordSchema, updateEmailSchema } from "../../validation/user.validation";
import { generateAndSaveToken, generateAuthToken, verifyToken } from "../../services/token.service";
import { findUserByEmail, createUser, updateUser, findUserById } from "../../services/user.service";
import { sendVerificationEmail, sendPasswordResetEmail } from "../../services/email.service";


/**
 * Registers a new user with email verification
 * @param req - The request object
 * @param res - The response object
 * @returns The created user if successful, otherwise an error response
 */
export const registerUserController = async (req: Request, res: Response) => {
    try {
        const validation = userRegisterSchema.safeParse(req.body);

        if (!validation.success) {
            return res.status(400).json({ errors: validation.error.issues });
        }

        const data = validation.data;
        // check if user already exists
        const existingUser = await findUserByEmail(data.email);
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // create user
        const user = await createUser(data);

        // Generate and save email verification token (expires in 2 hours)
        const verificationToken = await generateAndSaveToken(user.id, "EMAIL_VERIFICATION", 2);


        // Send an email to the user for verification
        const emailLink = `${process.env.CLIENT_URL!}/verify-email?token=${verificationToken}`;

        console.log("Verification email link: ", emailLink, "Verification token: ", verificationToken);

        await sendVerificationEmail(user.firstName, user.email, emailLink);

        res.status(201).json({ message: "User registered successfully", user });

    } catch (error) {
        console.log("Error in user registration: ", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

/**
 * Logs in a user and sets authentication cookie
 * @param req - The request object
 * @param res - The response object
 * @returns The authenticated user if successful, otherwise an error response
 */
export const loginUserController = async (req: Request, res: Response) => {
    try {
        const validation = userLoginSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({ errors: validation.error.issues });
        }

        const { email, password } = validation.data;

        const user = await findUserByEmail(email);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (!user.isEmailVerified) {
            return res.status(401).json({ message: "User not verified" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid password" });
        }

        const token = generateAuthToken(user.id, user.role);

        res.cookie('auth_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000 // 24 hours in milliseconds
        });

        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                role: user.role
            }
        });
    } catch (error) {
        console.log("Error in user login: ", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

/**
 * Gets the current user from the authentication cookie
 * @param req - The request object
 * @param res - The response object
 * @returns The current user if successful, otherwise an error response
 */
export const getCurrentUserController = async (req: Request, res: Response) => {
    try {
        const user = req.user;
        res.status(200).json({
            message: "User fetched successfully",
            user
        });
    } catch (error) {
        console.log("Error in fetching current user: ", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

/**
 * Logs out a user and clears the authentication cookie
 * @param req - The request object
 * @param res - The response object
 * @returns A success message if successful, otherwise an error response
 */
export const logoutUserController = async (req: Request, res: Response) => {
    try {
        res.clearCookie('auth_token');
        res.status(200).json({ message: "Logout successful" });
    } catch (error) {
        console.log("Error in user logout: ", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

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

        const emailLink = `${process.env.CLIENT_URL!}/verify-email?token=${verificationToken}`;

        console.log("Verification email link: ", emailLink, "Verification token: ", verificationToken);

        await sendVerificationEmail(user.firstName, user.email, emailLink);

        res.status(200).json({ message: "Verification email sent successfully" });
    } catch (error) {
        console.log("Error in resending verification email: ", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

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

        const userId = await verifyToken(token, "PASSWORD_RESET");
        if (!userId) {
            return res.status(401).json({ message: "Invalid or expired token" });
        }

        const { password, confirmPassword } = req.body;
        if (!password || !confirmPassword) {
            return res.status(400).json({ message: "Both password and confirm password are required" });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match" });
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
        const emailLink = `${process.env.CLIENT_URL!}/verify-email?token=${verificationToken}`;
        
        await sendVerificationEmail(user.firstName, email, emailLink);

        res.status(200).json({ message: "Email updated successfully. Verification email sent to the new email address." });
    } catch (error) {
        console.log("Error in update email: ", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
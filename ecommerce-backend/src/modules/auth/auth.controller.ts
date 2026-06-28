import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import { userLoginSchema, userRegisterSchema } from "../../validation/user.validation";
import { generateAndSaveToken, generateAuthToken } from "../../services/token.service";
import { findUserByEmail, createUser, findUserById } from "../../services/user.service";
import { sendVerificationEmail } from "../../services/email.service";

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
        const { passwordHash: _, ...safeUser } = await createUser(data);

        // Generate and save email verification token (expires in 2 hours)
        const verificationToken = await generateAndSaveToken(safeUser.id, "EMAIL_VERIFICATION", 2);

        // Send an email to the user for verification
        const emailLink = `${process.env.CLIENT_URL!}/verify-email?token=${verificationToken}`;

        console.log("Verification email link: ", emailLink, "Verification token: ", verificationToken);

        await sendVerificationEmail(safeUser.firstName, safeUser.email, emailLink);

        res.status(201).json({ message: "User registered successfully", user: safeUser });

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
            secure: true,
            sameSite: 'none',
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
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const user = await findUserById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const { passwordHash: _, ...safeUser } = user;

        res.status(200).json({
            message: "User fetched successfully",
            user: safeUser
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
        res.clearCookie('auth_token', {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
        });
        res.status(200).json({ message: "Logout successful" });
    } catch (error) {
        console.log("Error in user logout: ", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

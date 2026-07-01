import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import { userLoginSchema, userRegisterSchema } from "../../validation/user.validation";
import { generateAndSaveToken, generateAuthToken } from "../../services/token.service";
import { findUserByEmail, createUser, findUserById } from "../../services/user.service";
import { sendVerificationEmail } from "../../services/email.service";
import type { User } from "../../generated/prisma/client";

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
        const emailLink = `${process.env.CLIENT_URL!}/verify-email-token?token=${verificationToken}`;

        console.log("Verification email link: ", emailLink, "Verification token: ", verificationToken);

        // Send email asynchronously to avoid blocking the response
        sendVerificationEmail(safeUser.firstName, safeUser.email, emailLink)
            .then(() => console.log("Verification email sent successfully"))
            .catch((error) => console.error("Failed to send verification email:", error));

        // Respond immediately without waiting for email
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

    // Check if user has a password (OAuth users might not have one)
    if (!user.passwordHash) {
        return res.status(401).json({ message: "This account uses social login. Please use Google or Facebook to sign in." });
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

/**
 * Updates the current user's profile details
 * @param req - The request object containing profile data
 * @param res - The response object
 * @returns The updated user if successful, otherwise an error response
 */
export const updateProfileController = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const { updateProfileSchema } = await import("../../validation/user.validation");
        const validation = updateProfileSchema.safeParse(req.body);

        if (!validation.success) {
            return res.status(400).json({ errors: validation.error.issues });
        }

        const { updateUser } = await import("../../services/user.service");
        
        // ExactOptionalPropertyTypes protection
        const updateData: any = {};
        if (validation.data.firstName !== undefined) updateData.firstName = validation.data.firstName;
        if (validation.data.lastName !== undefined) updateData.lastName = validation.data.lastName;
        if (validation.data.phone !== undefined) updateData.phone = validation.data.phone;

        const updatedUser = await updateUser(userId, updateData);
        const { passwordHash: _, ...safeUser } = updatedUser;

        res.status(200).json({
            message: "Profile updated successfully",
            user: safeUser
        });

    } catch (error) {
        console.log("Error updating profile: ", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

/**
 * Deletes the current user's account permanently
 * @param req - The request object
 * @param res - The response object
 * @returns A success message if deleted
 */
export const deleteMyAccountController = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const { deleteUser } = await import("../../services/user.service");
        await deleteUser(userId);

        res.clearCookie('auth_token', {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
        });

        res.status(200).json({ message: "Account deleted successfully" });
    } catch (error) {
        console.log("Error deleting account: ", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


// GOOGLE OAUTH CONTROLLERS

/**
 * Initiates Google OAuth flow
 * This controller is automatically handled by passport.authenticate()
 * No need to define a function - just add the route with middleware
 */
// No controller function needed - handled by passport middleware

/**
 * Handles Google OAuth callback after user authenticates
 * @param req - The request object (contains req.user from passport)
 * @param res - The response object
 * @returns Redirects to frontend with JWT token or error
 */
export const googleCallbackController = async (req: Request, res: Response) => {
    try {
        // Passport attaches the authenticated user to req.user
        const user = req.user as User;

        if (!user) {
            // Authentication failed
            return res.redirect(`${process.env.CLIENT_URL}/auth/login?error=oauth_failed`);
        }

        // Generate JWT token for the authenticated user
        const token = generateAuthToken(user.id, user.role);

        // Set cookie (same as regular login)
        res.cookie('auth_token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 24 * 60 * 60 * 1000 // 24 hours
        });

        // Redirect to frontend with token in URL (frontend can also use cookie)
        // Option 1: Redirect with token in query param (frontend can extract and store)
        res.redirect(`${process.env.CLIENT_URL}/auth/callback?token=${token}`);

        // Option 2: Redirect to dashboard directly (rely on cookie only)
        // res.redirect(`${process.env.CLIENT_URL}/dashboard`);

    } catch (error) {
        console.error('Google OAuth callback error:', error);
        res.redirect(`${process.env.CLIENT_URL}/auth/login?error=server_error`);
    }
};

// FACEBOOK OAUTH CONTROLLERS

/**
 * Initiates Facebook OAuth flow
 * This controller is automatically handled by passport.authenticate()
 * No need to define a function - just add the route with middleware
 */
// No controller function needed - handled by passport middleware

/**
 * Handles Facebook OAuth callback after user authenticates
 * @param req - The request object (contains req.user from passport)
 * @param res - The response object
 * @returns Redirects to frontend with JWT token or error
 */
export const facebookCallbackController = async (req: Request, res: Response) => {
    try {
        // Passport attaches the authenticated user to req.user
        const user = req.user as User;

        if (!user) {
            // Authentication failed
            return res.redirect(`${process.env.CLIENT_URL}/auth/login?error=oauth_failed`);
        }

        // Generate JWT token for the authenticated user
        const token = generateAuthToken(user.id, user.role);

        // Set cookie (same as regular login)
        res.cookie('auth_token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 24 * 60 * 60 * 1000 // 24 hours
        });

        // Redirect to frontend with token in URL
        res.redirect(`${process.env.CLIENT_URL}/auth/callback?token=${token}`);

    } catch (error) {
        console.error('Facebook OAuth callback error:', error);
        res.redirect(`${process.env.CLIENT_URL}/auth/login?error=server_error`);
    }
};
import type { Request, Response } from "express";
import { userRegisterSchema } from "../../validation/user.validation";
import { generateAndSaveToken } from "../../services/token.service";
import { findUserByEmail, createUser } from "../../services/user.service";
import { sendVerificationEmail } from "../../services/email.service";
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
        const emailLink = `${process.env.CLIENT_URL || 'http://localhost:3000'}/verify-email?token=${verificationToken}`;
        await sendVerificationEmail(user.firstName, user.email, emailLink);

        res.status(201).json({ message: "User registered successfully", user });

    } catch (error) {
        console.log("Error in user registration: ", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
export const loginUserController = async () => { };
export const getCurrentUserController = async () => { };
export const logoutUserController = async () => { };
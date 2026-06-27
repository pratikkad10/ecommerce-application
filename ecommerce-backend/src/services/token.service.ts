import crypto from "crypto";
import { prisma } from "../config/prisma.config";
import { TokenType } from "../generated/prisma/enums";

/**
 * Reusable service to generate and save crypto verification tokens
 * 
 * @param userId - The ID of the user generating the token
 * @param type - The type of token (EMAIL_VERIFICATION, PASSWORD_RESET, etc.)
 * @param expireInHours - How many hours until the token expires
 * @returns The raw, plain-text token to send to the user
 */
export const generateAndSaveToken = async (
    userId: string,
    type: TokenType,
    expireInHours: number = 2
) => {
    // Generate secure random string
    const token = crypto.randomBytes(32).toString("hex");

    // Calculate expiration date
    const expiresAt = new Date(Date.now() + expireInHours * 60 * 60 * 1000);

    // Save to database
    await prisma.verificationToken.create({
        data: {
            token,
            type,
            userId,
            expiresAt,
        },
    });

    // Return the token so it can be emailed to the user
    return token;
};

/**
 * Generates a JSON Web Token (JWT) for authenticated user sessions
 * 
 * @param userId - The ID of the user generating the token
 * @returns The JWT token
 */
import jwt from "jsonwebtoken";

export const generateAuthToken = (userId: string, role: string) => {
    const secret = process.env.JWT_SECRET!;
    return jwt.sign({ userId, role }, secret, { expiresIn: "24h" });
};

/**
 * Verifies a crypto token from the database, ensuring it exists and hasn't expired.
 * Once verified, it automatically deletes the token to prevent reuse.
 * 
 * @param token - The raw token string
 * @param type - The expected TokenType
 * @returns The userId if successful, null if invalid or expired.
 */
export const verifyToken = async (token: string, type: TokenType): Promise<string | null> => {
    const dbToken = await prisma.verificationToken.findFirst({
        where: { token, type }
    });

    if (!dbToken || dbToken.expiresAt < new Date()) {
        return null;
    }

    // Token is valid! Delete it so it can't be reused
    await prisma.verificationToken.delete({
        where: { id: dbToken.id }
    });

    return dbToken.userId;
};

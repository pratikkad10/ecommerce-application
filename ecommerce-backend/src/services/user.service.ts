import { prisma } from "../config/prisma.config";
import type { UserRegisterType } from "../validation/user.validation";
import bcrypt from "bcrypt";

/**
 * Find a user by their email address
 * @param email - The email address to search for
 * @returns The user object if found, otherwise null
 */
export const findUserByEmail = async (email: string) => {
    return await prisma.user.findUnique({
        where: { email },
    });
};

/**
 * Find a user by their unique ID
 * @param id - The user ID to search for
 * @returns The user object if found, otherwise null
 */
export const findUserById = async (id: string) => {
    return await prisma.user.findUnique({
        where: { id },
    });
};

/**
 * Create a new user in the database
 * @param data - The validated user registration data
 * @returns The newly created user
 */
export const createUser = async (data: UserRegisterType) => {
    const hashedPassword = await bcrypt.hash(data.password, 10);

    return await prisma.user.create({
        data: {
            email: data.email,
            passwordHash: hashedPassword,
            firstName: data.firstName,
            lastName: data.lastName ?? null,
            phone: data.phone ?? null,
            role: data.role ?? "CUSTOMER",
        },
    });
};

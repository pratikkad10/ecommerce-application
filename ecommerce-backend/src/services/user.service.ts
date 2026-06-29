import { prisma } from "../config/prisma.config";
import type { UserRegisterType } from "../validation/user.validation";
import type { Profile as GoogleProfile } from 'passport-google-oauth20';
import type { Profile as FacebookProfile } from 'passport-facebook';
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

/**
 * Update an existing user in the database
 * @param id - The unique ID of the user to update
 * @param data - The partial data to update
 * @returns The updated user
 */
export const updateUser = async (id: string, data: any) => {
    return await prisma.user.update({
        where: { id },
        data,
    });
};

// GOOGLE OAUTH FUNCTIONS

/**
 * Find or create a user from Google OAuth profile
 * @param profile - Google OAuth profile object
 * @returns The user object (existing or newly created)
 */
export const findOrCreateGoogleUser = async (profile: GoogleProfile) => {
    // Extract data from Google profile
    const googleId = profile.id;
    const email = profile.emails?.[0]?.value;
    const firstName = profile.name?.givenName || profile.displayName?.split(' ')[0] || 'User';
    const lastName = profile.name?.familyName || profile.displayName?.split(' ').slice(1).join(' ') || null;
    
    // Validate email exists
    if (!email) {
        throw new Error('Email not provided by Google. Please grant email permission.');
    }

    // STEP 1: Check if user already exists with this googleId
    let user = await prisma.user.findUnique({
        where: { googleId },
    });

    if (user) {
        // User found with Google ID - return existing user
        return user;
    }

    // STEP 2: Check if user exists with this email (from local or Facebook login)
    user = await prisma.user.findUnique({
        where: { email },
    });

    if (user) {
        // User exists with this email but different provider
        // LINK THE ACCOUNT: Add googleId to existing user
        return await prisma.user.update({
            where: { id: user.id },
            data: {
                googleId,
                // Optionally update provider to GOOGLE if it was LOCAL
                // provider: 'GOOGLE',
            },
        });
    }

    // STEP 3: Create new user (first time Google login)
    return await prisma.user.create({
        data: {
            email,
            firstName,
            lastName,
            googleId,
            provider: 'GOOGLE',
            // No passwordHash needed for OAuth users
            passwordHash: null,
            // Auto-verify email for OAuth users (Google/Facebook verified it)
            isEmailVerified: true,
            isActive: true,
            role: 'CUSTOMER',
        },
    });
};

// FACEBOOK OAUTH FUNCTIONS

/**
 * Find or create a user from Facebook OAuth profile
 * @param profile - Facebook OAuth profile object
 * @returns The user object (existing or newly created)
 */
export const findOrCreateFacebookUser = async (profile: FacebookProfile) => {
    // Extract data from Facebook profile
    const facebookId = profile.id;
    const email = profile.emails?.[0]?.value;
    const firstName = profile.name?.givenName || profile.displayName?.split(' ')[0] || 'User';
    const lastName = profile.name?.familyName || profile.displayName?.split(' ').slice(1).join(' ') || null;
    
    // Validate email exists
    if (!email) {
        throw new Error('Email not provided by Facebook. Please grant email permission.');
    }

    // STEP 1: Check if user already exists with this facebookId
    let user = await prisma.user.findUnique({
        where: { facebookId },
    });

    if (user) {
        // User found with Facebook ID - return existing user
        return user;
    }

    // STEP 2: Check if user exists with this email (from local or Google login)
    user = await prisma.user.findUnique({
        where: { email },
    });

    if (user) {
        // User exists with this email but different provider
        // LINK THE ACCOUNT: Add facebookId to existing user
        return await prisma.user.update({
            where: { id: user.id },
            data: {
                facebookId,
                // Optionally update provider to FACEBOOK if it was LOCAL
                // provider: 'FACEBOOK',
            },
        });
    }

    // STEP 3: Create new user (first time Facebook login)
    return await prisma.user.create({
        data: {
            email,
            firstName,
            lastName,
            facebookId,
            provider: 'FACEBOOK',
            // No passwordHash needed for OAuth users
            passwordHash: null,
            // Auto-verify email for OAuth users (Google/Facebook verified it)
            isEmailVerified: true,
            isActive: true,
            role: 'CUSTOMER',
        },
    });
};
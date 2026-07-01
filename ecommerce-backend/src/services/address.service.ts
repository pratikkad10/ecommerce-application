import { prisma } from "../config/prisma.config";
import { CreateAddressInput, UpdateAddressInput } from "../validation/address.validation";

/**
 * @description Get all addresses for a user
 * @param userId - The ID of the user
 * @returns The user's addresses
 */
export const getUserAddresses = async (userId: string) => {
    return await prisma.address.findMany({
        where: { userId },
        orderBy: { isDefault: 'desc' } // Default address shows up first
    });
};

/**
 * @description Create address for user
 * @param userId - The ID of the user to create address for
 * @param data - The validated create data
 * @returns The created address
 */
export const createAddress = async (userId: string, data: CreateAddressInput) => {
    // If setting as default, unset any existing default address first
    if (data.isDefault) {
        await prisma.address.updateMany({
            where: { userId, isDefault: true },
            data: { isDefault: false }
        });
    }

    return await prisma.address.create({
        data: {
            ...data,
            isDefault: data.isDefault || false,
            userId
        }
    });
};

/**
 * @description Update address 
 * @param id - The ID of the address to update
 * @param userId - The ID of the user who owns the address
 * @param data - The validated update data
 * @returns The updated address
 */
export const updateAddress = async (id: string, userId: string, data: UpdateAddressInput) => {
    const address = await prisma.address.findFirst({
        where: { id, userId }
    });

    if (!address) return null;

    if (data.isDefault) {
        await prisma.address.updateMany({
            where: { userId, isDefault: true, id: { not: id } },
            data: { isDefault: false }
        });
    }

    const updateData: any = {};
    if (data.street !== undefined) updateData.street = data.street;
    if (data.city !== undefined) updateData.city = data.city;
    if (data.state !== undefined) updateData.state = data.state;
    if (data.country !== undefined) updateData.country = data.country;
    if (data.postalCode !== undefined) updateData.postalCode = data.postalCode;
    if (data.isDefault !== undefined) updateData.isDefault = data.isDefault;

    return await prisma.address.update({
        where: { id },
        data: updateData
    });
};

/**
 * @description Delete address
 * @param id - The ID of the address to delete
 * @param userId - The ID of the user who owns the address
 * @returns The deleted address
 */
export const deleteAddress = async (id: string, userId: string) => {
    const address = await prisma.address.findFirst({
        where: { id, userId }
    });

    if (!address) return null;

    return await prisma.address.delete({
        where: { id }
    });
};

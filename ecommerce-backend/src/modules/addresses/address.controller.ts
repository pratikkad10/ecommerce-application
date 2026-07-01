import { Request, Response } from "express";
import {
    getUserAddresses,
    createAddress,
    updateAddress,
    deleteAddress
} from "../../services/address.service";
import { createAddressSchema, updateAddressSchema } from "../../validation/address.validation";

/**
 * @description Get all addresses for the authenticated user
 * @param req - express request object
 * @param res - express response object
 * @returns JSON response with addresses array
 */
export const getAddressesController = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const addresses = await getUserAddresses(userId);

        return res.status(200).json({
            success: true,
            data: addresses
        });
    } catch (error) {
        console.error("error fetching addresses", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

/**
 * @description Create a new address for the authenticated user
 * @param req - express request containing address data in body
 * @param res - express response object
 * @returns JSON response with created address
 */
export const createAddressController = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const validation = createAddressSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: validation.error.format(),
            });
        }

        const address = await createAddress(userId, validation.data);

        return res.status(201).json({
            success: true,
            message: "Address created successfully",
            data: address
        });
    } catch (error: any) {
        console.error("error creating address", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

/**
 * @description Update an existing address for the authenticated user
 * @param req - express request containing address id in params and update data in body
 * @param res - express response object
 * @returns JSON response with updated address
 */
export const updateAddressController = async (req: Request<{ id: string }>, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const { id } = req.params;
        const validation = updateAddressSchema.safeParse(req.body);

        if (!validation.success) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: validation.error.format(),
            });
        }

        const address = await updateAddress(id, userId, validation.data);
        if (!address) {
            return res.status(404).json({ success: false, message: "Address not found" });
        }

        return res.status(200).json({
            success: true,
            message: "Address updated successfully",
            data: address
        });
    } catch (error: any) {
        console.error("error updating address", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

/**
 * @description Delete address for user
 * @param req - express request containing address id in params
 * @param res - express response object
 * @returns JSON response confirming deletion
 */
export const deleteAddressController = async (req: Request<{ id: string }>, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const { id } = req.params;

        const address = await deleteAddress(id, userId);
        if (!address) {
            return res.status(404).json({ success: false, message: "Address not found" });
        }

        return res.status(200).json({
            success: true,
            message: "Address deleted successfully"
        });
    } catch (error: any) {
        console.error("error deleting address", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

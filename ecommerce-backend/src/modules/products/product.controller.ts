import { Request, Response } from "express";
import { getPaginationParams, getPaginationMetadata } from "../../utils/pagination.utils";
import { getPaginatedProducts, getProductById, createNewProduct, updateExistingProduct } from "../../services/product.service";
import { createProductSchema, updateProductSchema } from "../../validation/product.validation";
import { generateSlug } from "../../utils/slug.utils";

/**
 * To Get All Products with pagination
 * @route GET /api/v1/products
 * @description This function is used to get all the products with pagination
 * @access Public
 * @param Request req - The request object
 * @param Response res - The response object
 * @returns Promise<Response> - The response object
 */
export const getAllProducts = async (req: Request, res: Response) => {
    try {
        // Get pagination params
        const { page, limit, skip } = getPaginationParams(req);

        // Fetch data
        const [products, totalProducts] = await getPaginatedProducts(skip, limit);

        return res.status(200).json({
            success: true,
            message: "Products fetched successfully",
            data: {
                products,
                // Generate metadata for pagination
                pagination: getPaginationMetadata(totalProducts, page, limit)
            },
        });
    } catch (error) {
        console.log("error fetching products", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}

/**
 * To Get Single Product
 * @route GET /api/v1/products/:id
 * @description This function is used to get single product
 * @access Public
 * @param Request req - The request object
 * @param Response res - The response object
 * @returns Promise<Response> - The response object
 */
export const getSingleProduct = async (req: Request<{ id: string }>, res: Response) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Product ID is required",
            });
        }

        const product = await getProductById(id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Product fetched successfully",
            data: product,
        });
    } catch (error) {
        console.log("error fetching product", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}


/**
 * To Create A New Product
 * @route POST /api/v1/products
 * @description This function is used to create a new product
 * @access Private (Admin only)
 * @param Request req - The request object
 * @param Response res - The response object
 * @returns Promise<Response> - The response object
 */
export const createProduct = async (req: Request, res: Response) => {
    try {
        const validation = createProductSchema.safeParse(req.body);

        if (!validation.success) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: validation.error.format(),
            });
        }

        const data = validation.data;

        const slug = generateSlug(data.name);

        const product = await createNewProduct(data, slug);

        return res.status(201).json({
            success: true,
            message: "Product created successfully",
            data: product,
        });
    } catch (error) {
        console.log("error creating product", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}

/**
 * To Update An Existing Product
 * @route PUT /api/v1/products/:id
 * @description This function is used to update an existing product
 * @access Private (Admin only)
 * @param Request req - The request object
 * @param Response res - The response object
 * @returns Promise<Response> - The response object
 */
export const updateProduct = async (req: Request<{ id: string }>, res: Response) => {
    try {
        const { id } = req.params;
        const validation = updateProductSchema.safeParse(req.body);

        if (!validation.success) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: validation.error.format(),
            });
        }

        const data = validation.data;

        let slug: string | undefined = undefined;
        // Only generate a new slug if the admin is actually updating the product's name
        if (data.name) {
            slug = generateSlug(data.name);
        }

        const product = await updateExistingProduct(id, data, slug);

        return res.status(200).json({
            success: true,
            message: "Product updated successfully",
            data: product,
        });
    } catch (error) {
        console.log("error updating product", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}
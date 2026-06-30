import { Request, Response } from "express";
import { getPaginationParams, getPaginationMetadata } from "../../utils/pagination.utils";
import { getPaginatedProducts } from "../../services/product.service";

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


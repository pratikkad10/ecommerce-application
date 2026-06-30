import { Request, Response } from "express";
import { prisma } from "../../config/prisma.config";


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
        // Extract page and limit from the query string (defaults to page 1, 10 items)
        const page = Math.max(1, parseInt(req.query.page as string) || 1);
        const limit = Math.max(1, parseInt(req.query.limit as string) || 10);

        // Calculate how many records to "skip"
        const skip = (page - 1) * limit;

        // Run both queries in parallel for better performance
        const [products, totalProducts] = await Promise.all([
            prisma.product.findMany({
                skip: skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            prisma.product.count(),
        ]);

        // Calculate total pages
        const totalPages = Math.ceil(totalProducts / limit);

        return res.status(200).json({
            success: true,
            message: "Products fetched successfully",
            data: {
                products,
                pagination: {
                    totalItems: totalProducts,
                    totalPages,
                    currentPage: page,
                    limit,
                }
            },
        });
    } catch (error) {
        console.log("error fetching products", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}


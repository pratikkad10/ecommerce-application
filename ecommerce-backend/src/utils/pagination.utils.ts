import { Request } from "express";

/**
 * Extracts page, limit, and skip values from the request query.
 */
export const getPaginationParams = (req: Request) => {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.max(1, parseInt(req.query.limit as string) || 10);
    const skip = (page - 1) * limit;

    return { page, limit, skip };
};

/**
 * Generates the standardized pagination metadata object for the response.
 */
export const getPaginationMetadata = (totalItems: number, page: number, limit: number) => {
    const totalPages = Math.ceil(totalItems / limit);

    return {
        totalItems,
        totalPages,
        currentPage: page,
        limit,
    };
};

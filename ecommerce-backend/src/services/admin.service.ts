import { prisma } from "../config/prisma.config";
import { UpdateOrderStatusInput, UpdateUserStatusInput } from "../validation/admin.validation";
import { getPaginationMetadata } from "../utils/pagination.utils";

/**
 * @description Get overall dashboard analytics
 * @returns Object with total revenue, total orders, total users, and recent orders
 */
export const getDashboardStats = async () => {
    // Execute all aggregate queries in parallel for maximum performance
    const [
        totalRevenueResult,
        totalOrders,
        totalUsers,
        recentOrders
    ] = await Promise.all([
        prisma.order.aggregate({
            where: { paymentStatus: 'PAID' },
            _sum: { totalAmount: true }
        }),
        prisma.order.count(),
        prisma.user.count({ where: { role: 'CUSTOMER' } }),
        prisma.order.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            include: {
                user: {
                    select: { firstName: true, lastName: true, email: true }
                }
            }
        })
    ]);

    return {
        totalRevenue: totalRevenueResult._sum.totalAmount || 0,
        totalOrders,
        totalUsers,
        recentOrders
    };
};

/**
 * @description Get all orders (paginated)
 * @param page - Page number
 * @param limit - Number of orders per page
 * @returns Object with orders and pagination metadata
 */
export const getAllOrdersAdmin = async (page: number = 1, limit: number = 10) => {
    const skip = (page - 1) * limit;

    const [orders, totalCount] = await Promise.all([
        prisma.order.findMany({
            skip,
            take: limit,
            orderBy: { createdAt: 'desc' },
            include: {
                user: {
                    select: { firstName: true, lastName: true, email: true }
                },
                items: {
                    include: {
                        variant: {
                            include: {
                                product: { select: { images: true } }
                            }
                        }
                    }
                }
            }
        }),
        prisma.order.count()
    ]);

    return {
        orders,
        pagination: getPaginationMetadata(totalCount, page, limit)
    };
};


/**
 * @description Update order status
 * @param orderId - The ID of the order to update
 * @param data - The validated update data
 * @returns The updated order
 */
export const updateOrderStatusAdmin = async (orderId: string, data: UpdateOrderStatusInput) => {
    return await prisma.order.update({
        where: { id: orderId },
        data: { status: data.status }
    });
};

/**
 * @description Get all users (paginated)
 * @param page - Page number
 * @param limit - Number of users per page
 * @returns Object with users and pagination metadata
 */
export const getAllUsersAdmin = async (page: number = 1, limit: number = 10) => {
    const skip = (page - 1) * limit;

    const [users, totalCount] = await Promise.all([
        prisma.user.findMany({
            skip,
            take: limit,
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                role: true,
                isActive: true,
                createdAt: true,
                _count: {
                    select: { orders: true }
                }
            }
        }),
        prisma.user.count()
    ]);

    return {
        users,
        pagination: getPaginationMetadata(totalCount, page, limit)
    };
};

/**
 * @description Update user status
 * @param userId - The ID of the user to update
 * @param data - The validated update data
 * @returns The updated user
 */
export const updateUserAdmin = async (userId: string, data: UpdateUserStatusInput) => {
    const updateData: any = {};
    if (data.isActive !== undefined) updateData.isActive = data.isActive;
    if (data.role !== undefined) updateData.role = data.role;

    return await prisma.user.update({
        where: { id: userId },
        data: updateData
    });
};

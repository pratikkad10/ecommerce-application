import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

/**
 * Generic Authentication & Authorization Middleware
 * 
 * @param allowedRoles - (Optional) Array of roles allowed to access the route. 
 *                     If omitted, ANY authenticated user can access it.
 */
export const requireAuth = (allowedRoles: string[] = []) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            // Extract the token from cookies OR the Authorization header
            let token = req.cookies?.auth_token;

            if (!token && req.headers.authorization?.startsWith("Bearer ")) {
                token = req.headers.authorization.split(" ")[1];
            }

            // If no token is found, block the request
            if (!token) {
                res.status(401).json({ message: "Authentication required. Please log in." });
                return;
            }

            // Verify the JWT token
            const secret = process.env.JWT_SECRET!;
            const decoded = jwt.verify(token, secret) as any;

            // Attach the decoded payload to req.user so controllers can access it!
            req.user = decoded;

            // Role-Based Authorization Check
            if (allowedRoles.length > 0 && !allowedRoles.includes(decoded.role)) {
                res.status(403).json({ message: "Forbidden: You do not have permission to access this resource." });
                return;
            }

            // User is authenticated (and authorized), proceed to the controller
            next();
        } catch (error) {
            console.error("Auth Middleware Error:", error);
            res.status(401).json({ message: "Invalid or expired token. Please log in again." });
            return;
        }
    };
};

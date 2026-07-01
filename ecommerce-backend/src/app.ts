import express, { type Request, type Response } from "express";
import authRouter from "./routes/auth.routes";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import passport from "./config/passport.config";
import productRouter from "./routes/product.routes";
import sizeRouter from "./routes/size.routes";
import colorRouter from "./routes/color.routes";
import cartRouter from "./routes/cart.routes";
import wishlistRouter from "./routes/wishlist.routes";
import orderRouter from "./routes/order.routes";
import reviewRouter from "./routes/review.routes";
import adminRouter from "./routes/admin.routes";
import addressRouter from "./routes/address.routes";
import multer from "multer";

const app = express();
console.log(process.env.CLIENT_URL);

// Security middleware
app.use(helmet());
app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true
}));

// Parsing middleware
app.use(express.json());
app.use(cookieParser());

// Passport middleware
app.use(passport.initialize());
// Note: We're NOT using passport.session() because we're using JWT, not sessions

// Testing route
app.get("/", (req: Request, res: Response) => {
    res.json({ message: "Server is running" });
});

// API routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/products', productRouter);
app.use('/api/v1/sizes', sizeRouter);
app.use('/api/v1/colors', colorRouter);
app.use('/api/v1/cart', cartRouter);
app.use('/api/v1/wishlist', wishlistRouter);
app.use('/api/v1/orders', orderRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/admin', adminRouter);
app.use('/api/v1/addresses', addressRouter);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (err instanceof multer.MulterError) {
        return res.status(400).json({ success: false, message: err.message });
    }
    if (err) {
        return res.status(400).json({ success: false, message: err.message });
    }
    next();
});

export default app;
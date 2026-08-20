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
import categoryRouter from "./routes/category.routes";
import campaignRouter from "./routes/campaign.routes";
import multer from "multer";

const app = express();
console.log(process.env.CLIENT_URL);

// Allowed origins list
const allowedOrigins = [
  process.env.CLIENT_URL?.replace(/\/$/, ""),
  "https://ecommerce-application-pied-five.vercel.app",
  "http://localhost:5173",
  "http://localhost:3000",
  "http://localhost:5174",
].filter(Boolean) as string[];

// Security middleware
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or Postman)
      if (!origin) return callback(null, true);

      const isAllowed =
        allowedOrigins.includes(origin) ||
        origin.endsWith(".vercel.app") ||
        (process.env.CLIENT_URL && origin === process.env.CLIENT_URL.replace(/\/$/, ""));

      if (isAllowed) {
        callback(null, true);
      } else {
        callback(new Error(`CORS blocked for origin: ${origin}`));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie", "X-Requested-With", "Accept"],
    exposedHeaders: ["Set-Cookie"],
  })
);

// Parsing middleware
app.use(express.json());
app.use(cookieParser());

// Passport middleware
app.use(passport.initialize());
// Note: We're NOT using passport.session() because we're using JWT, not sessions

// Health check handler
const healthCheckHandler = (_req: Request, res: Response) => {
  res.status(200).json({
    status: "ok",
    message: "Server is healthy",
    uptime: `${Math.floor(process.uptime())}s`,
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  });
};

// Root & Health check routes
app.get("/", healthCheckHandler);
app.get("/health", healthCheckHandler);
app.get("/api/v1/health", healthCheckHandler);

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
app.use('/api/v1/categories', categoryRouter);
app.use('/api/v1/campaigns', campaignRouter);

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
import express, { type Request, type Response } from "express";
import authRouter from "./routes/auth.routes";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";

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

// Testing route
app.get("/", (req: Request, res: Response) => {
    res.json({ message: "Server is running" });
});

// API routes
app.use('/api/v1/auth', authRouter);

export default app;
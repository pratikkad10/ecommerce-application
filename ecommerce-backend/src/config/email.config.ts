import nodemailer from "nodemailer";

// Create a reusable transporter object using SMTP transport
export const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.example.com",
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.NODE_ENV === "production", // Recommended: true for production (port 465), false for dev
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

const connectionString = process.env.DATABASE_URL;

// Enable SSL for remote PostgreSQL databases (Render, Supabase, Neon, AWS RDS, etc.)
const isRemoteDb = Boolean(
  connectionString &&
    !connectionString.includes("localhost") &&
    !connectionString.includes("127.0.0.1")
);

const pool = new Pool({
  connectionString,
  ssl: isRemoteDb ? { rejectUnauthorized: false } : undefined,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export { prisma };
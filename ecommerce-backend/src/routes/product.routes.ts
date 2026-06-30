import express from "express";
import { getAllProducts } from "../modules/products/product.controller";

const router = express.Router();

/**
 * @description This route is used to get all the products with pagination
 * @route GET /api/v1/products
 * @access Public
 */
router.get("/", getAllProducts);

export default router;
import express from "express";
import { getAllProducts, getSingleProduct } from "../modules/products/product.controller";

const router = express.Router();

/**
 * @description This route is used to get all the products with pagination
 * @route GET /api/v1/products
 * @access Public
 */
router.get("/", getAllProducts);

/**
 * @description This route is used to get single product
 * @route GET /api/v1/products/:id
 * @access Public
 */
router.get("/:id", getSingleProduct);

export default router;
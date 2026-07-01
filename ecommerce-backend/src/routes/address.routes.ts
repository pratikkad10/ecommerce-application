import express from "express";
import { 
    getAddressesController, 
    createAddressController, 
    updateAddressController, 
    deleteAddressController 
} from "../modules/addresses/address.controller";
import { requireAuth } from "../middlewares/auth.middleware";

const router = express.Router();

/**
 * @route GET /api/v1/addresses
 * @access Private
 */
router.get("/", requireAuth(), getAddressesController);

/**
 * @route POST /api/v1/addresses
 * @access Private
 */
router.post("/", requireAuth(), createAddressController);

/**
 * @route PUT /api/v1/addresses/:id
 * @access Private
 */
router.put("/:id", requireAuth(), updateAddressController);

/**
 * @route DELETE /api/v1/addresses/:id
 * @access Private
 */
router.delete("/:id", requireAuth(), deleteAddressController);

export default router;

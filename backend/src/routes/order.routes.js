import express from "express";
import { requireAuth, allowRoles } from "../middleware/auth.js";
import { placeOrder, getMyOrders } from "../controllers/order.controller.js";

const router = express.Router();

// Place order (Customer only)
router.post("/", requireAuth, allowRoles("customer"), placeOrder);

// Get logged-in customer orders
router.get("/my-orders", requireAuth, allowRoles("customer"), getMyOrders);

export default router;

import express from "express";
import { requireAuth, allowRoles } from "../middleware/auth.js";
import {
  placeOrder,
  getMyOrders,
  getOwnerOrders,
  updateOrderStatus
} from "../controllers/order.controller.js";

const router = express.Router();

// Customer places an order
router.post("/", requireAuth, allowRoles("customer"), placeOrder);

// Customer views their own orders
router.get("/my-orders", requireAuth, allowRoles("customer"), getMyOrders);

// Owner views orders for their bakery
router.get(
  "/owner-orders",
  requireAuth,
  allowRoles("owner"),
  getOwnerOrders
);

// Owner updates order status
router.put(
  "/status/:id",
  requireAuth,
  allowRoles("owner"),
  updateOrderStatus
);

export default router;

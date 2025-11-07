import express from "express";
import { requireAuth, allowRoles } from "../middleware/auth.js";
import {
  createOrder,
  getOrdersByCustomer,
  getOrdersByBakery,
  updateOrderStatus,
} from "../controllers/order.controller.js";

const router = express.Router();

// 🧁 Customer: Place order
router.post("/", requireAuth, allowRoles("customer"), createOrder);

// 🧾 Customer: Get own orders
router.get(
  "/my-orders",
  requireAuth,
  allowRoles("customer"),
  getOrdersByCustomer
);

// 🍰 Owner: Get all orders for bakery
router.get(
  "/bakery/:bakeryId",
  requireAuth,
  allowRoles("owner"),
  getOrdersByBakery
);

// 🔄 Owner: Update order status
router.patch(
  "/:id/status",
  requireAuth,
  allowRoles("owner"),
  updateOrderStatus
);

export default router;

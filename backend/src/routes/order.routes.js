import express from "express";
import { requireAuth, allowRoles } from "../middleware/auth.js";

import {
  placeOrder,
  getMyOrders,
  getOwnerOrders,
  updateOrderStatus,
  updatePaymentStatus,
} from "../controllers/order.controller.js";

import { getOrderById } from "../controllers/order.controller.js";


const router = express.Router();

// Customer places an order
router.post("/", requireAuth, allowRoles("customer"), placeOrder);

// Customer views their own orders
router.get("/my-orders", requireAuth, allowRoles("customer"), getMyOrders);

// Owner views orders for their bakery
router.get("/owner-orders", requireAuth, allowRoles("owner"), getOwnerOrders);

// Owner updates ORDER STATUS
router.put("/status/:id", requireAuth, allowRoles("owner"), updateOrderStatus);

// Owner updates PAYMENT STATUS (COD → Paid)
router.put(
  "/update-payment/:id",
  requireAuth,
  allowRoles("owner"),
  updatePaymentStatus
);


// Customer: Get single order (for invoice)
router.get("/:id", requireAuth, allowRoles("customer"), getOrderById);

export default router;

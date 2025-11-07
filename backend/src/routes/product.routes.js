import express from "express";
import { requireAuth, allowRoles } from "../middleware/auth.js";
import {
  createProduct,
  getProductsByBakery,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controller.js";

const router = express.Router();

// 🧁 Owner Only: Create Product
router.post("/", requireAuth, allowRoles("owner"), createProduct);

// 🍰 Get Products for a Bakery (Public)
router.get("/:bakeryId", getProductsByBakery);

// ✏️ Owner: Update Product
router.put("/:id", requireAuth, allowRoles("owner"), updateProduct);

// ❌ Owner: Delete Product
router.delete("/:id", requireAuth, allowRoles("owner"), deleteProduct);

export default router;

import express from "express";
import { requireAuth, allowRoles } from "../middleware/auth.js";
import {
  createMenuItem,
  getMenuItems,
  updateMenuItem,
  deleteMenuItem,
} from "../controllers/menu.controller.js";

const router = express.Router();

// ✅ Get all menu items for bakery owner
router.get("/", requireAuth, allowRoles("owner"), getMenuItems);

// ✅ Add a new menu item
router.post("/", requireAuth, allowRoles("owner"), createMenuItem);

// ✅ Edit menu item
router.put("/:id", requireAuth, allowRoles("owner"), updateMenuItem);

// ✅ Delete menu item
router.delete("/:id", requireAuth, allowRoles("owner"), deleteMenuItem);

export default router;

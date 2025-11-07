import express from "express";
import { requireAuth, allowRoles } from "../middleware/auth.js";
import {
  addMenuItem,
  getMenuItems,
  deleteMenuItem,
} from "../controllers/menu.controller.js";

const router = express.Router();

// Owner adds/deletes menu
router.post("/", requireAuth, allowRoles("owner"), addMenuItem);
router.delete("/:id", requireAuth, allowRoles("owner"), deleteMenuItem);

// Everyone (customer/admin) can view bakery menu
router.get("/:bakeryId", getMenuItems);

export default router;

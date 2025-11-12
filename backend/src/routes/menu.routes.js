import express from "express";
import { requireAuth, allowRoles } from "../middleware/auth.js";
import {
  createMenuItem,
  getOwnerMenu,
} from "../controllers/menu.controller.js";

const router = express.Router();

// 🧁 Routes
router.post("/", requireAuth, allowRoles("owner"), createMenuItem);
router.get("/", requireAuth, allowRoles("owner"), getOwnerMenu);

export default router;

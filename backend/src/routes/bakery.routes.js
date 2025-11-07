import express from "express";
import { requireAuth, allowRoles } from "../middleware/auth.js";
import {
  createBakery,
  getAllBakeries,
  getBakeryById,
  approveBakery,
} from "../controllers/bakery.controller.js";

const router = express.Router();

// 🧁 Public — get all approved bakeries
router.get("/", getAllBakeries);

// 🔍 Public — get one bakery by ID
router.get("/:id", getBakeryById);

// 👑 Admin only — create bakery (optional)
router.post("/", requireAuth, allowRoles("admin"), createBakery);

// ✅ Admin only — approve bakery
router.patch("/:id/approve", requireAuth, allowRoles("admin"), approveBakery);

export default router;

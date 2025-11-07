import express from "express";
import {
  createBakery,
  getAllBakeries,
  approveBakery,
} from "../controllers/bakery.controller.js";
import { requireAuth, allowRoles } from "../middleware/auth.js";

const router = express.Router();

// 🧁 Owner creates a bakery (pending approval)
router.post("/", requireAuth, allowRoles(["owner"]), createBakery);

// 🌍 Customers view only approved bakeries
router.get("/", getAllBakeries);

// 👑 Admin approves bakery
router.put("/:id/approve", requireAuth, allowRoles(["admin"]), approveBakery);

export default router;

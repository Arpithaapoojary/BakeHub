import express from "express";
import {
  getApprovedBakeries,
  getBakeryById,
  registerBakery,
  approveBakery,
} from "../controllers/bakery.controller.js";

import { requireAuth, allowRoles } from "../middleware/auth.js";

const router = express.Router();

// Customer — browse approved bakeries
router.get("/", getApprovedBakeries);

// Customer — view specific bakery details
router.get("/:id", getBakeryById);

// Owner — register a new bakery
router.post("/", requireAuth, allowRoles("owner"), registerBakery);

// Admin — approve bakery
router.put("/:id/approve", requireAuth, allowRoles("admin"), approveBakery);

export default router;

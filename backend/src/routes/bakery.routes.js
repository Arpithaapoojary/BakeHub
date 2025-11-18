import express from "express";
import { requireAuth, allowRoles } from "../middleware/auth.js";
import {
  getMyBakery,
  getBakeryById,
  getAllBakeries,
  approveBakery,
  rejectBakery,
} from "../controllers/bakery.controller.js";

const router = express.Router();

// Owner: Get logged-in owner's bakery
router.get("/mine", requireAuth, allowRoles("owner"), getMyBakery);

// Admin: Get all bakeries (pending + approved + rejected)
router.get("/", requireAuth, allowRoles("admin"), getAllBakeries);

// Admin: Approve bakery
router.put("/:id/approve", requireAuth, allowRoles("admin"), approveBakery);

// Admin: Reject bakery
router.put("/:id/reject", requireAuth, allowRoles("admin"), rejectBakery);

// Public: Get bakery by ID
router.get("/:id", getBakeryById);

export default router;

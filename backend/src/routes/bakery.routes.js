import express from "express";
import { requireAuth, allowRoles } from "../middleware/auth.js";
import {
  getMyBakery,
  getApprovedBakeries,
  getBakeryById,
} from "../controllers/bakery.controller.js";

const router = express.Router();

// Owner: Get logged-in owner's bakery
router.get("/mine", requireAuth, allowRoles("owner"), getMyBakery);

// Public: Get approved bakeries
router.get("/", getApprovedBakeries);

// Public: Get bakery by ID
router.get("/:id", getBakeryById);

export default router;

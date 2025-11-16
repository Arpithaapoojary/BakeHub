import express from "express";
import { requireAuth, allowRoles } from "../middleware/auth.js";
import {
  getMyBakery,
  getApprovedBakeries,
  getBakeryById,
} from "../controllers/bakery.controller.js";

const router = express.Router();

router.get("/mine", requireAuth, allowRoles("owner"), getMyBakery);

router.get("/", getApprovedBakeries);

router.get("/:id", getBakeryById);

export default router;

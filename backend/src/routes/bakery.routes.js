import express from "express";
import { requireAuth, allowRoles } from "../middleware/auth.js";
import { getOwnerBakery } from "../controllers/bakery.controller.js";

const router = express.Router();

// ✅ Route to get bakery owned by logged-in owner
router.get("/mine", requireAuth, allowRoles("owner"), getOwnerBakery);

export default router;

import express from "express";
import {
  registerCustomer,
  registerOwner,
  registerAdmin,
  login,
  getAllUsers,
} from "../controllers/auth.controller.js";
import { requireAuth, allowRoles } from "../middleware/auth.js";

const router = express.Router();

// 👥 Public routes
router.post("/register-customer", registerCustomer);
router.post("/register-owner", registerOwner);
router.post("/register-admin", registerAdmin);
router.post("/login", login);

// 👑 Admin-only route
router.get("/users", requireAuth, allowRoles("admin"), getAllUsers);

export default router;

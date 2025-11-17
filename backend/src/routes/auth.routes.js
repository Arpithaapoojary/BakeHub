import express from "express";
import {
  registerCustomer,
  registerOwner,
  registerAdmin,
  login,
  forgotPassword,
  resetPassword,
} from "../controllers/auth.controller.js";
import { requireAuth, allowRoles } from "../middleware/auth.js";

const router = express.Router();
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
// 👥 Public routes
router.post("/register-customer", registerCustomer);
router.post("/register-owner", registerOwner);
router.post("/register-admin", registerAdmin);
router.post("/login", login);

// 👑 Admin-only route

export default router;

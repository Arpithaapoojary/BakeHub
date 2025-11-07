import { Router } from "express";
import {
  registerCustomer,
  registerOwner,
  registerAdmin,
  login,
  getAllUsers
} from "../controllers/auth.controller.js";

import { requireAuth, allowRoles } from "../middleware/auth.js";

const router = Router();

router.post("/register-customer", registerCustomer);
router.post("/register-owner", registerOwner);
router.post("/register-admin", registerAdmin);
router.post("/login", login);


// ✅ new route — only admin can view all users
router.get("/users", requireAuth, allowRoles("admin"), getAllUsers);

export default router;

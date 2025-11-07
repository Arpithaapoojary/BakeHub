import { Router } from "express";
import {
  registerCustomer,
  registerOwner,
  registerAdmin,
  login,
} from "../controllers/auth.controller.js";

const router = Router();

router.post("/register-customer", registerCustomer);
router.post("/register-owner", registerOwner);
router.post("/register-admin", registerAdmin); // optional
router.post("/login", login);

export default router;

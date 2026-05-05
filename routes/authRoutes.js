import express from "express";
import {
  registerInit,
  loginUser,
  verifyOtp,
} from "../controllers/authController.js";

const router = express.Router();

/**
 * AUTH ROUTES (EMAIL OTP SYSTEM)
 */

// Register user + send email OTP
router.post("/register-init", registerInit);

// Login user
router.post("/login", loginUser);

// Verify OTP (email-based)
router.post("/verify-otp", verifyOtp);

export default router;
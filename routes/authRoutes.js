import express from "express";
import {
  registerInit,
  loginUser,
  verifyOtp,
  resendOtp,
  forgotPassword,
  resetPassword,
  logoutUser
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * AUTH ROUTES (EMAIL OTP SYSTEM)
 */

// Register user + send email OTP
router.post("/register-init", protect,  registerInit);

// Login user
router.post("/login", protect,  loginUser);

// Verify OTP (email-based)
router.post("/verify-otp", protect,  verifyOtp);
router.post("/resend-otp",  protect, resendOtp);
router.post("/forgot-password", protect, forgotPassword);

router.put("/reset-password/:token", protect,  resetPassword);
router.post("/logout", protect,  logoutUser);

export default router;

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
router.post("/resend-otp", resendOtp);
router.post("/forgot-password", forgotPassword);

router.put("/reset-password/:token", resetPassword);
router.post("/logout", logoutUser);

export default router;

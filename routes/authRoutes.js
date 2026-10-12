import express from "express";

import {
  registerInit,
  loginUser,
  verifyOtp,
  resendOtp,
  forgotPassword,
  resetPassword,
  logoutUser,
  resumeRegistration,
} from "../controllers/authController.js";

import {
  updateProfileImage,
  uploadProfileImageMiddleware,
} from "../controllers/profileImageController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Registration
router.post("/register-init", registerInit);
router.post("/resume-registration", resumeRegistration);

// Authentication
router.post("/login", loginUser);
router.post("/verify-otp", verifyOtp);
router.post("/resend-otp", resendOtp);

// Password recovery
router.post("/forgot-password", forgotPassword);
router.put("/reset-password/:token", resetPassword);

// Logout
router.post("/logout", logoutUser);

// Profile picture
router.put(
  "/profile-image",
  protect,
  uploadProfileImageMiddleware,
  updateProfileImage
);

export default router;

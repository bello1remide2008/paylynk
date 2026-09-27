import express from "express";

import {
  getWallet,
  createWallet,
} from "../controllers/walletController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// All wallet routes require authentication
router.use(protect);

// Fetch wallet
router.get("/", getWallet);

// Create wallet
router.post("/create", createWallet);

export default router;


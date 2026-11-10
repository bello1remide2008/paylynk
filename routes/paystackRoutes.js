
import express from "express";

import {
  getBanks,
  resolveAccount,
} from "../controllers/paystackController.js";

const router = express.Router();

// Get list of banks
router.get("/banks", getBanks);

// Resolve bank account details
router.post("/resolve-account", resolveAccount);

export default router;


import express from "express";

import {
fetchBanks,
  resolveAccount,
} from "../controllers/paystackController.js";

const router = express.Router();

// Get list of banks
router.get("/fetch-banks", fetchBanks);

// Resolve bank account details
router.post("/resolve-account", resolveAccount);

export default router;

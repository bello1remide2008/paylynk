import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { linkAccount } from "../controllers/onePipeController.js";

const router = express.Router();

router.post("/link-account", protect, linkAccount);

export default router; 

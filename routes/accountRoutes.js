import express from "express";
import {
  connectAccount,
  getAccounts,
  setDefaultAccount,
} from "../controllers/accountController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, connectAccount);
router.get("/", protect, getAccounts);
router.patch("/default", protect, setDefaultAccount);

export default router;
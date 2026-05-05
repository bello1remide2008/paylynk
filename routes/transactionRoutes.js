import express from "express";
import {
  sendMoney,
  getTransactions,
  receiveMoney,
} from "../controllers/transactionController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/send", protect, sendMoney);
router.get("/:accountId", protect, getTransactions);
router.post("/receive", protect, receiveMoney);

export default router;
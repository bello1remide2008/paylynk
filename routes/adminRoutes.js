import express from "express";
import {
  getUsers,
  getUserDetails,
  getAdminStats,
  getUserProfile,
  blockUser,
  unblockUser,
  reverseTransaction,
  getUserByPhone,
  sendMailToUsers,
    freezeAccount,
    unfreezeAccount,
} from "../controllers/adminController.js";

import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";
import { sendAdminOtp } from "../controllers/adminController.js";

const router = express.Router();

router.get("/users", protect, adminOnly, getUsers);
router.get("/users/:id", protect, adminOnly, getUserDetails);
router.get("/stats", protect, adminOnly, getAdminStats);
router.get("/user/:id", protect, adminOnly, getUserProfile);

router.patch("/block/:id", protect, adminOnly, blockUser);
router.patch("/unblock/:id", protect, adminOnly, unblockUser);

router.post("/reverse/:id", protect, adminOnly, reverseTransaction);
router.post("/send-otp", protect, adminOnly, sendAdminOtp);
router.get("/user-by-phone/:phone", protect, adminOnly, getUserByPhone);
router.post("/send-mail/:id", protect, adminOnly, sendMailToUsers);
router.post("/freeze-account/:id", protect, adminOnly, freezeAccount);
router.post("/unfreeze-account/:id", protect, adminOnly, unfreezeAccount);

export default router;
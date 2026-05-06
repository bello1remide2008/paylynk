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
import { adminProtect } from "../middleware/adminMiddleware.js";
import { sendAdminOtp } from "../controllers/adminController.js";

const router = express.Router();

router.get("/users", protect, adminProtect, getUsers);
router.get("/users/:id", protect, adminProtect, getUserDetails);
router.get("/stats", protect, adminProtect, getAdminStats);
router.get("/user/:id", protect, adminProtect, getUserProfile);

router.patch("/block/:id", protect, adminProtect, blockUser);
router.patch("/unblock/:id", protect, adminProtect, unblockUser);

router.post("/reverse/:id", protect, adminProtect, reverseTransaction);
router.post("/send-otp", protect, adminProtect, sendAdminOtp);
router.get("/user-by-phone/:phone", protect, adminProtect, getUserByPhone);
router.post("/send-mail/:id", protect, adminProtect, sendMailToUsers);
router.post("/freeze-account/:id", protect, adminProtect, freezeAccount);
router.post("/unfreeze-account/:id", protect, adminProtect, unfreezeAccount);

export default router;

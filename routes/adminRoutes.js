import express from "express";
import {
  getUsers,
  getUserDetails,
  getAdminStats,
  getUserProfile,
  blockUser,
  unblockUser,
  reverseTransaction,
  sendMailToUsers,
    freezeAccount,
    unfreezeAccount,
} from "../controllers/adminController.js";


import { adminProtect } from "../middleware/adminMiddleware.js";
import { sendAdminOtp } from "../controllers/adminController.js";
import { getAnalytics } from "../controllers/adminController.js";

const router = express.Router();

router.get("/users", adminProtect, getUsers);

router.get("/users/:id", adminProtect, getUserDetails);

router.get("/stats", adminProtect, getAdminStats);
router.get(
  "/analytics",
  protectAdmin,
  getAnalytics
);

router.get("/user/:id", adminProtect, getUserProfile);
router.get("/search-user", adminProtect, async (req, res) => {
  try {
    const query = req.query.query;

    const user = await User.findOne({
      $or: [
        { email: { $regex: query, $options: "i" } },
        { phone: { $regex: query, $options: "i" } },
        
      ],
    });

    if (!user) {
      return res.json({
        message: "User not found",
      });
    }

    res.json({ user });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

router.patch("/block/:id", adminProtect, blockUser);

router.patch("/unblock/:id", adminProtect, unblockUser);

router.post("/reverse/:id", adminProtect, reverseTransaction);

router.post("/send-otp", adminProtect, sendAdminOtp);

router.post("/send-mail", adminProtect, sendMailToUsers);

router.post("/freeze-account/:id", adminProtect, freezeAccount);

router.post("/unfreeze-account/:id", adminProtect, unfreezeAccount);
export default router;

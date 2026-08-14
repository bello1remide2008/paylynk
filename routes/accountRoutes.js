import express from "express";

import {
  connectAccount,
  getAccounts,
  setDefaultAccount,
  sendMoney,
  unLinkAccount,
  refreshAccount,
  getDashboardInsight,
  getSpendingAnalytics,
  getBanks,
  verifyAccount,
} from "../controllers/accountController.js";

import { protect } from "../middleware/authMiddleware.js";

import { checkAccountOwnership }
from "../middleware/accountMiddleware.js";

const router = express.Router();

router.post(
  "/send",
  protect,
  checkAccountOwnership,
  sendMoney
);

router.post(
  "/",
  protect,
  connectAccount
);

router.get(
  "/",
  protect,
  getAccounts
);

router.patch(
  "/default",
  protect,
  setDefaultAccount
);
router.delete(
"/:id",
protect,
unlinkAccount
);

router.get(
"/refresh/:id",
protect,
refreshAccount
);
router.get(
    "/dashboard-insight",
    protect,
    getDashboardInsight
);

router.get(
"/spending-analytics",
protect,
getSpendingAnalytics
);

router.get(
  "/banks",
  protect,
  getBanks
);
router.post(
  "/verify",
  protect,
  verifyAccount
);


export default router;

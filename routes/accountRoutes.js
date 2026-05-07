import express from "express";

import {
  connectAccount,
  getAccounts,
  setDefaultAccount,
  sendMoney,
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

export default router;

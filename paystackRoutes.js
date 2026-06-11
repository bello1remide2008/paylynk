import express from "express";
import { resolveAccount } from "../controllers/paystackController.js";

const router = express.Router();

router.post("/resolve-account", resolveAccount);

export default router;
import User from "../models/User.js";
import Account from "../models/Account.js";
import { linkBankAccount } from "../services/onePipeService.js";

export const linkAccount = async (req, res) => {
  try {
    const { bankCode, accountNumber } = req.body;

    const result = await linkBankAccount({
      userId: req.user._id,
      bankCode,
      accountNumber,
    });

    const account = await Account.create({
      userId: req.user._id,
      bankName: result.bankName,
      bankCode,
      accountNumber: result.accountNumber,
      accountName: result.accountName,
      institutionId: result.institutionId,
      isDefault: true,
    });

    res.status(201).json({
      success: true,
      message: "Bank account linked successfully",
      account,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
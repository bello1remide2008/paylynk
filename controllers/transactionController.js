import Transaction from "../models/Transaction.js";
import Account from "../models/Account.js";
import { sendEmail } from "../services/emailService.js";
import User from "../models/User.js";



// ✅ SEND MONEY
export const sendMoney = async (req, res) => {
  try {
    const {
      accountId,
      amount,
      receiverBank,
      receiverAccount,
      receiverName,
    } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    const account = await Account.findById(accountId);

    if (!account) {
      return res.status(404).json({ message: "Account not found" });
    }

    // ✅ freeze check FIXED
    if (account.isFrozen) {
      return res.status(403).json({
        message: "Account is frozen. Transactions not allowed.",
      });
    }

    if (account.balance < amount) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    // deduct balance
    account.balance -= amount;
    await account.save();

    const transaction = await Transaction.create({
      userId: req.user._id,
      accountId,
      type: "debit",
      amount,
      receiverBank,
      receiverAccount,
      receiverName,
      senderBank: account.bankName,
      status: "success",
      reference: "TXN-" + Date.now(),
    });

    return res.status(201).json({
      success: true,
      transaction,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// ✅ GET TRANSACTIONS (PER ACCOUNT)
export const getTransactions = async (req, res) => {
  try {
    const { accountId } = req.params;

    const transactions = await Transaction.find({
      accountId,
      userId: req.user._id,
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      transactions,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const receiveMoney = async (req, res) => {
  try {
    const {
      accountId,
      amount,
      senderAccountNumber,
      senderBankName,
    } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    const account = await Account.findById(accountId);

    if (!account) {
      return res.status(404).json({ message: "Account not found" });
    }

    account.balance += amount;
    await account.save();

    const tx = await Transaction.create({
      userId: account.userId,
      accountId: account._id,
      type: "credit",
      amount,
      description: "Transfer In",
      senderAccountNumber,
      senderBankName,
      receiverAccountNumber: account.accountNumber,
      receiverBankName: account.bankName,
    });

    const user = await User.findById(account.userId);

    if (user) {
      await sendEmail({
        to: user.email,
        subject: "Credit Alert 💰",
        text: `You received ₦${amount} into ${account.bankName} (${account.accountNumber})`,
      });
    }

    res.json({ success: true, tx });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

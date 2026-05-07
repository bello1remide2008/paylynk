import Account from "../models/Account.js";
import Transaction from "../models/Transaction.js";
import User from "../models/User.js";
import { sendEmail } from "../services/emailService.js";

export const sendMoney = async (req, res) => {
  try {
    const { amount, senderAccountId, receiverAccountNumber, receiverBankName } = req.body;

    const senderAccount = await Account.findById(senderAccountId);

    if (!senderAccount) {
      return res.status(404).json({ message: "Sender account not found" });
    }

    if (senderAccount.balance < amount) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    // 🔻 debit sender
    senderAccount.balance -= amount;
    await senderAccount.save();

    // 🔻 save transaction
    const tx = await Transaction.create({
      userId: senderAccount.userId,
      accountId: senderAccount._id,
      type: "debit",
      amount,
      description: "Transfer Out",

      senderAccountNumber: senderAccount.accountNumber,
      senderBankName: senderAccount.bankName,

      receiverAccountNumber,
      receiverBankName,
    });

    // 🔔 Email alert
    const user = await User.findById(senderAccount.userId);

    await sendEmail({
      to: user.email,
      subject: "Debit Alert 💸",
      text: `You sent ₦${amount} from ${senderAccount.bankName} (${senderAccount.accountNumber})`,
    });

    res.json({ success: true, tx });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ✅ CONNECT BANK ACCOUNT 
export const connectAccount = async (req, res) => {
  try {
    const { bankName, accountNumber, accountName } = req.body;

    const account = await Account.create({
      userId: req.user._id,
      bankName,
      accountNumber,
      accountName,
      balance: 0,
    });

    res.status(201).json({
      success: true,
      account,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }

await sendEmail({
  to: req.user.email,
  subject: "Bank Connected",
  text: `Your ${bankName} account has been successfully linked.`,
});
};

// ✅ GET USER ACCOUNTS
export const getAccounts = async (req, res) => {
  try {
    const accounts = await Account.find({ userId: req.user._id });

    res.json({
      success: true,
      accounts,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ✅ SET DEFAULT ACCOUNT
export const setDefaultAccount = async (req, res) => {
  try {
    const { accountId } = req.body;

    // remove previous default
    await Account.updateMany(
      { userId: req.user._id },
      { isDefault: false }
    );

    // set new default
  const account = await Account.findOneAndUpdate(
  {
    _id: accountId,
    userId: req.user._id,
  },
  {
    isDefault: true,
  },
  {
    new: true,
  }
);

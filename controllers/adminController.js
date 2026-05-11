import User from "../models/User.js";
import Account from "../models/Account.js";
import Transaction from "../models/Transaction.js";
import { sendEmail } from "../services/emailService.js";


// ✅ GET ALL USERS (WITH SEARCH)
export const getUsers = async (req, res) => {
  try {
    const keyword = req.query.search
      ? {
          $or: [
            { name: { $regex: req.query.search, $options: "i" } },
            { email: { $regex: req.query.search, $options: "i" } },
            { phone: { $regex: req.query.search, $options: "i" } },
          ],
        }
      : {};

    const users = await User.find(keyword).select("-password");

    res.json({
      success: true,
      users,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ✅ GET SINGLE USER PROFILE + LINKED ACCOUNTS
export const getUserDetails = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    const accounts = await Account.find({ userId: req.params.id });

    const transactions = await Transaction.find({
      userId: req.params.id,
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      user,
      accounts,
      transactions,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ✅ DASHBOARD STATS

export const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalAccounts = await Account.countDocuments();
    const totalTransactions = await Transaction.countDocuments();

    const last24Hours = new Date(
  Date.now() - 24 * 60 * 60 * 1000
);

const recentUsers = await User.find({
  createdAt: { $gte: last24Hours },
})
.sort({ createdAt: -1 })
.limit(10);

    const recentTransactions = await Transaction.find()
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      totalUsers,
      totalAccounts,
      totalTransactions,
      recentUsers,
      recentTransactions,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    const accounts = await Account.find({ userId: user._id });

    const transactions = await Transaction.find({
      userId: user._id,
    }).sort({ createdAt: -1 });

    res.json({
      user,
      accounts,
      transactions,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const blockUser = async (req, res) => {
  const user = await User.findById(req.params.id);

  user.isBlocked = true;
  await user.save();

  res.json({ message: "User blocked" });
};
export const unblockUser = async (req, res) => {
  const user = await User.findById(req.params.id);

  user.isBlocked = false;
  await user.save();

  res.json({ message: "User unblocked" });
};
export const reverseTransaction = async (req, res) => {
  try {
    const tx = await Transaction.findById(req.params.id);

    if (!tx) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    if (tx.isReversed) {
      return res.status(400).json({ message: "Already reversed" });
    }

    const account = await Account.findById(tx.accountId);

    if (!account) {
      return res.status(404).json({ message: "Account not found" });
    }

    // 🔥 Reverse logic
    if (tx.type === "debit") {
      account.balance += tx.amount;
    } else {
      account.balance -= tx.amount;
    }

    await account.save();

    tx.isReversed = true;
    tx.reversedAt = new Date();

    await tx.save();

    res.json({
      success: true,
      message: "Transaction reversed successfully",
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const sendAdminOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);

    console.log("ADMIN OTP:", otp);

    const sent = await sendEmail({
      to: email,
      subject: "Admin OTP Verification",
      text: `Your OTP is ${otp}`,
      html: `
        <div style="font-family: Arial;">
          <h2>Admin OTP</h2>
          <h1>${otp}</h1>
          <p>This code expires in 5 minutes.</p>
        </div>
      `,
    });

    if (!sent) {
      return res.status(500).json({
        success: false,
        message: "Failed to send email OTP",
      });
    }

    res.json({
      success: true,
      message: "OTP sent to email",
      // REMOVE IN PRODUCTION
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const sendMailToUsers = async (req, res) => {
  try {
    const { message } = req.body;

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const success = await sendEmail({
      to: user.email,
      subject: "Message from Paylynk Admin",
      text: message,
      html: `
        <div style="font-family: Arial;">
          <h2>Paylynk Notification</h2>
          <p>${message}</p>
        </div>
      `,
    });

    if (!success) {
      return res.status(500).json({
        message: "Failed to send email",
      });
    }

    res.json({
      success: true,
      message: "Mail sent successfully",
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const freezeAccount = async (req, res) => {
  const { id } = req.params;

  const account = await Account.findById(id);

  if (!account) {
    return res.status(404).json({ message: "Account not found" });
  }

  account.isFrozen = true;
  await account.save();

  res.json({ success: true, message: "Account frozen" });
};
export const unfreezeAccount = async (req, res) => {
  const { id } = req.params;

  const account = await Account.findById(id);

  if (!account) {
    return res.status(404).json({ message: "Account not found" });
  }

  account.isFrozen = false;
  await account.save();

  res.json({ success: true, message: "Account unfrozen" });
};

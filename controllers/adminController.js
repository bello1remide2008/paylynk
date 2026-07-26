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
    const totalUsers =
await User.countDocuments();

const totalLinkedAccounts =
await Account.countDocuments({
    linked: true,
});

const totalTransactions =
await Transaction.countDocuments();

const activeSessions =
await User.countDocuments({
    isOnline: true,
});

const pendingVerifications =
await User.countDocuments({
    verificationStatus: "pending",
});

const failedTransactions =
await Transaction.countDocuments({
    status: "failed",
});

 

const recentUsers = await User.find({
  createdAt: { $gte: last24Hours },
})
.sort({ createdAt: -1 })
.limit(10)
     .select("name email phone");

    const recentTransactions = await Transaction.find()
      .sort({ createdAt: -1 })
      .limit(5);
    const today = new Date();
today.setHours(0, 0, 0, 0);

const todaysUsers = await User.countDocuments({
  createdAt: { $gte: today },
});

const todaysTransactions = await Transaction.countDocuments({
  createdAt: { $gte: today },
});

const totalVolume = await Transaction.aggregate([
  {
    $match: {
      status: "success",
    },
  },
  {
    $group: {
      _id: null,
      total: {
        $sum: "$amount",
      },
    },
  },
]);

const revenue = await Transaction.aggregate([
  {
    $match: {
      status: "success",
      createdAt: { $gte: today },
    },
  },
  {
    $group: {
      _id: null,
      total: {
        $sum: "$amount",
      },
    },
  },
]);

    res.json({
    totalUsers,
    totalLinkedAccounts,
    totalTransactions,
    activeSessions,
    pendingVerifications,
    failedTransactions,
    recentUsers,
    recentTransactions,
       todaysUsers,
    todaysTransactions,

    totalVolume:
        totalVolume[0]?.total || 0,

    todaysRevenue:
        revenue[0]?.total || 0,
});

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

import User from "../models/User.js";
import Account from "../models/Account.js";
import Transaction from "../models/Transaction.js";

export const getAnalytics = async (req, res) => {
  try {
    // =========================
    // DATE SETUP
    // =========================

    const now = new Date();

    const currentYear = now.getFullYear();

    const startOfYear = new Date(currentYear, 0, 1);

    const sevenDaysAgo = new Date(
      Date.now() - 7 * 24 * 60 * 60 * 1000
    );

    const startToday = new Date();
    startToday.setHours(0, 0, 0, 0);

    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    // =========================
    // DASHBOARD COUNTS
    // =========================

    const totalUsers = await User.countDocuments();

    const verifiedUsers = await User.countDocuments({
      isVerified: true,
    });

    const pendingUsers = await User.countDocuments({
      isVerified: false,
    });

    const linkedAccounts = await Account.countDocuments();

    const activeSessions = await User.countDocuments({
      isOnline: true,
    });

    const successTransactions =
      await Transaction.countDocuments({
        status: "success",
      });

    const failedTransactions =
      await Transaction.countDocuments({
        status: "failed",
      });

    // =========================
    // MONTHLY USERS
    // =========================

    const monthlyUsers = await User.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startOfYear,
          },
        },
      },
      {
        $group: {
          _id: {
            $month: "$createdAt",
          },
          users: {
            $sum: 1,
          },
        },
      },
      {
        $sort: {
          _id: 1,
        },
      },
    ]);

    const formattedUsers = monthlyUsers.map((item) => ({
      month: months[item._id - 1],
      users: item.users,
    }));

    // =========================
    // REVENUE TREND
    // =========================

    const revenueTrend = await Transaction.aggregate([
      {
        $match: {
          status: "success",
        },
      },
      {
        $group: {
          _id: {
            $month: "$createdAt",
          },
          amount: {
            $sum: "$amount",
          },
        },
      },
      {
        $sort: {
          _id: 1,
        },
      },
    ]);

    const formattedRevenue = revenueTrend.map((item) => ({
      month: months[item._id - 1],
      amount: item.amount,
    }));

    // =========================
    // LAST 7 DAYS TRANSACTIONS
    // =========================

    const transactionTrend =
      await Transaction.aggregate([
        {
          $match: {
            createdAt: {
              $gte: sevenDaysAgo,
            },
          },
        },
        {
          $group: {
            _id: {
              $dateToString: {
                format: "%d %b",
                date: "$createdAt",
              },
            },
            transactions: {
              $sum: 1,
            },
          },
        },
        {
          $sort: {
            _id: 1,
          },
        },
      ]);

    const formattedTransactions =
      transactionTrend.map((item) => ({
        day: item._id,
        transactions: item.transactions,
      }));

    // =========================
    // TODAY'S REVENUE
    // =========================

    const todaysRevenue =
      await Transaction.aggregate([
        {
          $match: {
            status: "success",
            createdAt: {
              $gte: startToday,
            },
          },
        },
        {
          $group: {
            _id: null,
            total: {
              $sum: "$amount",
            },
          },
        },
      ]);

    // =========================
    // TOTAL TRANSACTION VOLUME
    // =========================

    const totalVolume =
      await Transaction.aggregate([
        {
          $match: {
            status: "success",
          },
        },
        {
          $group: {
            _id: null,
            total: {
              $sum: "$amount",
            },
          },
        },
      ]);

    // =========================
    // AVERAGE TRANSACTION
    // =========================

    const averageTransaction =
      await Transaction.aggregate([
        {
          $match: {
            status: "success",
          },
        },
        {
          $group: {
            _id: null,
            average: {
              $avg: "$amount",
            },
          },
        },
      ]);

    // =========================
    // BIGGEST TRANSACTION
    // =========================

    const biggestTransaction =
      await Transaction.findOne().sort({
        amount: -1,
      });

    // =========================
    // TOP USERS
    // =========================

    const topUsers =
      await Transaction.aggregate([
        {
          $group: {
            _id: "$userId",
            total: {
              $sum: "$amount",
            },
          },
        },
        {
          $sort: {
            total: -1,
          },
        },
        {
          $limit: 5,
        },
      ]);

    // =========================
    // TOP BANKS
    // =========================

    const topBanks =
      await Account.aggregate([
        {
          $group: {
            _id: "$bankName",
            accounts: {
              $sum: 1,
            },
          },
        },
        {
          $sort: {
            accounts: -1,
          },
        },
        {
          $limit: 5,
        },
      ]);

    // =========================
    // RESPONSE
    // =========================

    res.status(200).json({
      totalUsers,
      verifiedUsers,
      pendingUsers,
      linkedAccounts,
      activeSessions,
      successTransactions,
      failedTransactions,

      monthlyUsers: formattedUsers,

      transactionTrend:
        formattedTransactions,

      revenueTrend:
        formattedRevenue,

      todaysRevenue:
        todaysRevenue[0]?.total || 0,

      totalVolume:
        totalVolume[0]?.total || 0,

      averageTransaction:
        averageTransaction[0]?.average || 0,

      biggestTransaction,

      topUsers,

      topBanks,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
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
  await logActivity({
  userId: req.user._id,
  title: "Money Transfer",
  description: `${req.user.name} transferred ₦${amount} to ${receiverName}.`,
  type: "transaction",
  icon: "💸",
});

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

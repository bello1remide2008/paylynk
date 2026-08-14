import Account from "../models/Account.js";
import Transaction from "../models/Transaction.js";
import User from "../models/User.js";
import { sendEmail } from "../services/emailService.js";
import { fetchBanks,verifyBankAccount, } from "../services/paystackService.js";


export const getBanks = async (req, res) => {
  try {
    const result = await fetchBanks();

    if (!result.status) {
      return res.status(400).json({
        success: false,
        message:
          result.message ||
          "Unable to fetch banks",
      });
    }

    return res.status(200).json({
      success: true,
      banks: result.data,
    });

  } catch (error) {
    console.error(
      "Fetch banks error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Unable to retrieve banks",
    });
  }
};
export const verifyAccount = async (req, res) => {
  try {
    const {
      accountNumber,
      bankCode,
    } = req.body;

    // Validate account number
    if (!accountNumber) {
      return res.status(400).json({
        success: false,
        message: "Account number is required",
      });
    }

    if (!/^\d{10}$/.test(accountNumber)) {
      return res.status(400).json({
        success: false,
        message:
          "Account number must contain exactly 10 digits",
      });
    }

    // Validate bank
    if (!bankCode) {
      return res.status(400).json({
        success: false,
        message: "Bank code is required",
      });
    }

    const result =
      await verifyBankAccount(
        accountNumber,
        bankCode
      );

    if (!result.status) {
      return res.status(400).json({
        success: false,
        message:
          result.message ||
          "Unable to verify account",
      });
    }

    return res.status(200).json({
      success: true,

      account: {
        accountNumber:
          result.data.account_number,

        accountName:
          result.data.account_name,

        bankCode:
          bankCode,
      },
    });

  } catch (error) {
    console.error(
      "Verify account controller error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Account verification failed",
    });
  }
};

// ✅ SEND MONEY
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

    await logActivity({
  userId: req.user._id,
  title: "Money Transfer",
  description: `${req.user.name} transferred ₦${amount} to ${receiverName}.`,
  type: "transaction",
  icon: "💸",
});

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

    // ✅ validate fields
    if (!bankName || !accountNumber || !accountName) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // ✅ create account
    const account = await Account.create({
      userId: req.user._id,
      bankName,
      bankCode,
      accountNumber,
      accountName,
      balance: 0,
    });

    if (
      !bankName ||
      !bankCode ||
      !accountNumber ||
      !accountName
    ) {
      return res.status(400).json({
        success: false,
        message:
          "All account details are required",
      });
    }

    // Check if account already exists
    const existingAccount =
      await Account.findOne({
        userId,
        accountNumber,
        bankCode,
      });

    if (existingAccount) {
      return res.status(409).json({
        success: false,
        message:
          "This bank account is already linked",
      });
    }

    // Check whether user already has
    // a default account
    const accountCount =
      await Account.countDocuments({
        userId,
        status: "active",
      });

    const isFirstAccount =
      accountCount === 0;

    const account = await Account.create({
      userId,

      bankName,

      bankCode,

      accountNumber,

      accountName,

      verified: true,

      isDefault: isFirstAccount,

      status: "active",
    });
    // ✅ send email after successful account creation
    await sendEmail({
      to: req.user.email,
      subject: "Bank Connected",
      text: `Your ${bankName} account has been successfully linked.`,
      html: `
        <div style="font-family: Arial;">
          <h2>Bank Connected Successfully</h2>
          <p>Your bank account has been linked.</p>
          <ul>
            <li><strong>Bank:</strong> ${bankName}</li>
            <li><strong>Account Number:</strong> ${accountNumber}</li>
            <li><strong>Account Name:</strong> ${accountName}</li>
          </ul>
          <p>Thank you for using PayLynk.</p>
        </div>
      `,
    });
    await logActivity({
  userId: req.user._id,
  title: "Bank Linked",
  description: `${req.user.name} linked ${bankName}.`,
  type: "bank",
  icon: "🏦",
});

    // ✅ response
    res.status(201).json({
      success: true,
      message: "Account connected successfully",
      account,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: error.message,
    });
  }
};

// ✅ GET USER ACCOUNTS
export const getLinkedAccounts = async (
  req,
  res
) => {
  try {
    const accounts =
      await Account.find({
        userId: req.user._id,
        status: "active",
      }).sort({
        isDefault: -1,
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,
      accounts,
    });

  } catch (error) {
    console.error(
      "Get linked accounts error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to retrieve linked accounts",
    });
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

    res.json({
      success: true,
      message: "Default account updated",
      account,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const unlinkAccount = async (req, res) => {
  try {

    const account = await Account.findByIdAndUpdate(
      req.params.id,
      {
        isActive: false,
      },
      {
        new: true,
      }
    );

    res.json({
      success: true,
      message: "Account unlinked",
    });

  } catch (error) {
    res.status(500).json({
      success:false,
      message:error.message,
    });
  }
};
export const refreshAccount = async (req,res)=>{

const account=await Account.findById(req.params.id);

res.json({

success:true,

account

});

}
export const getDashboardInsight = async (req, res) => {
  try {

    const userId = req.user._id;

    const totalAccounts = await Account.countDocuments({
      userId,
    });

    const transactions = await Transaction.find({
      userId,
    });

    let income = 0;
    let expense = 0;

    transactions.forEach((trx) => {
      if (trx.type === "credit") {
        income += trx.amount;
      }

      if (trx.type === "debit") {
        expense += trx.amount;
      }
    });

    res.json({
      success: true,

      totalIncome: income,

      totalExpense: expense,

      totalTransactions: transactions.length,

      totalAccounts,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getSpendingAnalytics = async (req, res) => {
  try {

    const userId = req.user._id;

    const transactions = await Transaction.find({
      userId,
      type: "debit",
    });

    const months = [
      "Jan","Feb","Mar","Apr","May","Jun",
      "Jul","Aug","Sep","Oct","Nov","Dec"
    ];

    const monthly = new Array(12).fill(0);

    transactions.forEach((trx) => {

      const month = new Date(trx.createdAt).getMonth();

      monthly[month] += trx.amount;

    });

    const monthlyData = months.map((month,index)=>({
      month,
      amount: monthly[index],
    }));

    const totalSpent = monthly.reduce((a,b)=>a+b,0);

    const averageSpent =
      totalSpent / 12;

    const highest =
      monthly.indexOf(Math.max(...monthly));

    res.json({

      success:true,

      monthlyData,

      totalSpent,

      averageSpent,

      highestMonth: months[highest],

    });

  } catch(error){

      res.status(500).json({
        message:error.message,
      });

  }
};

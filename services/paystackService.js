
import axios from "axios";

const paystack = axios.create({
  baseURL:
    process.env.PAYSTACK_BASE_URL ||
    "https://api.paystack.co",

  headers: {
    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
    "Content-Type": "application/json",
  },
});

// ===============================
// GET BANKS
// ===============================

export const getBanks = async () => {
  try {
    const response = await paystack.get("/bank");

    return response.data;
  } catch (error) {
    console.error(
      "Paystack bank list error:",
      error.response?.data || error.message
    );

    throw new Error(
      error.response?.data?.message ||
      "Unable to retrieve banks"
    );
  }
};

// ===============================
// VERIFY BANK ACCOUNT
// ===============================

export const verifyBankAccount = async (
  accountNumber,
  bankCode
) => {
  try {
    const response = await paystack.get(
      "/bank/resolve",
      {
        params: {
          account_number: accountNumber,
          bank_code: bankCode,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "Paystack account verification error:",
      error.response?.data || error.message
    );

    throw new Error(
      error.response?.data?.message ||
      "Unable to verify bank account"
    );
  }
};

// ===============================
// RESOLVE BANK ACCOUNT (CONTROLLER)
// ===============================

export const resolveAccount = async (req, res) => {
  try {
    const { accountNumber, bankCode } = req.body;

    if (!accountNumber || !bankCode) {
      return res.status(400).json({
        success: false,
        message: "Account number and bank code are required",
      });
    }

    const result = await verifyBankAccount(
      accountNumber,
      bankCode
    );

    return res.status(200).json({
      success: true,
      accountName: result.data.account_name,
      accountNumber: result.data.account_number,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message:
        error.message || "Account verification failed",
    });
  }
};

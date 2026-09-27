import Wallet from "../models/Wallet.js";

// ======================================
// GET LOGGED-IN USER'S WALLET
// GET /api/wallet
// ======================================
export const getWallet = async (req, res) => {
  try {
    let wallet = await Wallet.findOne({
      user: req.user._id,
    });

    // Create wallet if it doesn't exist
    if (!wallet) {
      wallet = await Wallet.create({
        user: req.user._id,
        balance: 0,
        currency: "NGN",
      });
    }

    return res.status(200).json({
      success: true,
      wallet: {
        id: wallet._id,
        balance: wallet.balance,
        currency: wallet.currency,
        createdAt: wallet.createdAt,
        updatedAt: wallet.updatedAt,
      },
    });
  } catch (error) {
    console.error("GET WALLET ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve wallet",
    });
  }
};

// ======================================
// CREATE WALLET
// POST /api/wallet/create
// ======================================
export const createWallet = async (req, res) => {
  try {
    const existingWallet = await Wallet.findOne({
      user: req.user._id,
    });

    if (existingWallet) {
      return res.status(200).json({
        success: true,
        message: "Wallet already exists",
        wallet: {
          id: existingWallet._id,
          balance: existingWallet.balance,
          currency: existingWallet.currency,
        },
      });
    }

    const wallet = await Wallet.create({
      user: req.user._id,
      balance: 0,
      currency: "NGN",
    });

    return res.status(201).json({
      success: true,
      message: "Wallet created successfully",
      wallet: {
        id: wallet._id,
        balance: wallet.balance,
        currency: wallet.currency,
      },
    });
  } catch (error) {
    console.error("CREATE WALLET ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to create wallet",
    });
  }
};


import mongoose from "mongoose";

// ======================================
// WALLET SCHEMA
// ======================================

const WalletSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    balance: {
      type: Number,
      default: 0.00,
      min: 0,
    },

    currency: {
      type: String,
      default: "NGN",
    },
  },
  {
    timestamps: true,
  }
);

// ======================================
// TRANSACTION SCHEMA
// ======================================

const TransactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  amount: {
    type: Number,
    required: true,
  },

  type: {
    type: String,
    enum: ["deposit", "payment", "withdrawal"],
    required: true,
  },

  status: {
    type: String,
    enum: ["pending", "completed", "failed"],
    default: "completed",
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// ======================================
// MODELS
// ======================================

const Wallet = mongoose.models.Wallet ||
  mongoose.model("Wallet", WalletSchema);

const Transaction = mongoose.models.Transaction ||
  mongoose.model("Transaction", TransactionSchema);

// ES MODULE EXPORTS

export { Wallet, Transaction };

export default Wallet;

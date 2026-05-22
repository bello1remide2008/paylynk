import mongoose from "mongoose";

const adminWalletSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: "PayLynk Reserve",
    },

    balance: {
      type: Number,
      default: 0,
    },

    vatBalance: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "AdminWallet",
  adminWalletSchema
);
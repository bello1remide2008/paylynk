import mongoose from "mongoose";

const accountSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    bankName: {
      type: String,
      required: true,
    },

    accountNumber: {
      type: String,
      required: true,
    },

    accountName: {
      type: String,
      required: true,
    },

    paystackAccountId: {
      type: String, 
    },

    balance: {
      type: Number,
      default: 0,
    },

    currency: {
      type: String,
      default: "NGN",
    },

    isDefault: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
     isFrozen: {
    type: Boolean,
    default: false,
  },
  },
  { timestamps: true }
);

export default mongoose.model("Account", accountSchema);
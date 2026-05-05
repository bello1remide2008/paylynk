import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    accountId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
      required: true,
    },

    type: {
      type: String,
      enum: ["credit", "debit"],
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    currency: {
      type: String,
      default: "NGN",
    },

    receiverBank: {
      type: String,
    },

    receiverAccount: {
      type: String,
    },

    receiverName: {
      type: String,
    },

    senderBank: {
      type: String,
    },

    status: {
      type: String,
      enum: ["pending", "success", "failed"],
      default: "pending",
    },

    reference: {
      type: String,
      unique: true,
    },

    narration: {                 
      type: String,
    },
    isReversed: {
  type: Boolean,
  default: false,
},

reversedAt: Date,
  },
  { timestamps: true }
);

export default mongoose.model("Transaction", transactionSchema);
import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      enum: [
        "signup",
        "login",
        "logout",
        "verification",
        "bank",
        "transaction",
        "admin",
      ],
      default: "signup",
    },

    icon: {
      type: String,
      default: "🟢",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Activity", activitySchema);

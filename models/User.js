import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    phone: {
  type: String,
      required: true,
      unique: true,
},

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    isVerified: {
      type: Boolean,
      default: false,
    },isOnline: {
  type: Boolean,
  default: false,
},

lastSeen: {
  type: Date,
},
    isOnline: {
  type: Boolean,
  default: false,
},

lastSeen: {
  type: Date,
},
 otp: {
  type: String,
},

otpExpires: {
  type: Date,
},
    bvn: {
  type: String,
},

bvnVerified: {
  type: Boolean,
  default: false,
},

paystackCustomerCode: {
  type: String,
},

virtualAccountNumber: {
  type: String,
},

virtualAccountBank: {
  type: String,
},
  
  profileImage: {
  type: String,
  default: "https://via.placeholder.com/150",
},
        resetPasswordToken: {
      type:String,
    resetPasswordExpire: Date,
        },
isBlocked: {
  type: Boolean,
  default: false,
},
  },
 { timestamps: true }, 
);


// 🔐 Hash password before saving
// 🔐 Hash password before saving
userSchema.pre("save", async function () { // Removed 'next' here
  if (!this.isModified("password")) return; // Removed 'next()' call

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  // No need to call next() when using an async function
});


// 🔑 Compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};
const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;

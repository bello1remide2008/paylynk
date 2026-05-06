import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import { sendEmail } from "../services/emailService.js";

// ========================
// REGISTER INIT (EMAIL OTP)
// ========================
export const registerInit = async (req, res, ) => {
  try {
    console.log("REQ BODY:", req.body);

    const { name, email, password, phone } = req.body;

    if (!name || !email || !password || !phone) {
      return res.status(400).json({ message: "All fields required" });
    }

    // check existing user
    const existing = await User.findOne({
  $or: [
    { phone },
    { email: email.toLowerCase() }
  ],
});

    if (existing) {
      return res.status(400).json({
        message:
          existing.email === email
            ? "Email already exists"
            : "Phone number already exists",
      });
    }

    // create user
    const user = await User.create({
      name,
      email,
      password,
      phone,
      isVerified: false,
    });

    // generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000);

    console.log("🔥 OTP GENERATED:", otp);

    // store OTP in DB
    user.otp = otp;
    user.otpExpires = Date.now() + 5 * 60 * 1000;
    await user.save();

    // send email OTP
    const sent = await sendEmail({
      to: user.email,
      subject: "Your PayLynk OTP Code",
      text: `Your OTP is ${otp}`,
      html: `
        <div style="font-family: Arial;">
          <h2>PayLynk Verification</h2>
          <p>Your OTP code is:</p>
          <h1>${otp}</h1>
          <p>This code expires in 5 minutes.</p>
        </div>
      `,
    });

    if (!sent) {
      await User.findByIdAndDelete(user._id);
      return res.status(500).json({
        message: "Failed to send email OTP",
      });
    }
    if (!user.otp || !user.otpExpires) {
  return res.status(400).json({ message: "OTP not found, request new one" });
}

    res.json({
  success: true,
  message: "OTP sent to email",
  userId: user._id,
});
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ========================
// VERIFY OTP
// ========================
export const verifyOtp = async (req, res) => {
  try {
    const { userId, otp } = req.body;

    if (!userId || !otp) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (String(user.otp) !== String(otp)) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (user.otpExpires < Date.now()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    user.isVerified = true;
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    res.json({
      success: true,
      message: "Account verified",
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ========================
// LOGIN
// ========================
export const loginUser = async (req, res) => {
  try {
    const { phone, password } = req.body;

    const user = await User.findOne({ phone });

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (!user.isVerified) {
      return res.status(403).json({ message: "Verify your account first" });
    }
const token = generateToken(user._id);
    res.json({
      success: true,
      token: generateToken(user._id),
      user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const resendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate new OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Hash it (recommended)
    const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

    user.otp = hashedOtp;
    user.otpExpires = Date.now() + 5 * 60 * 1000; // 5 mins

    await user.save();
     await resend.emails.send({
      from: "onboarding@resend.dev", // change later
      to: email,
      subject: "Your OTP Code",
      html: `<h2>Your OTP is: ${otp}</h2>`
      });

    // Send OTP again (email or SMS)
    console.log("New OTP:", otp); // for testing

    return res.json({ message: "OTP resent successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error resending OTP" });
  }
};

import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import { sendEmail } from "../services/emailService.js";
import { logActivity } from "../utils/activityLogger.js";
import { randomInt } from "node:crypto";

import crypto from "crypto";

const escapeHtml = (value = "") => {
  return String(value).replace(/[&<>"']/g, (char) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };

    return entities[char];
  });
};



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
    {  email: email.toLowerCase()}
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
  email: email.trim().toLowerCase(),
  password,
  phone: phone.trim(),
  isVerified: false,
  registrationStatus: "pending_email",
});
    // generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

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
  await logActivity({
  userId: user._id,
  title: "New Registration",
  description: `${user.name} created an account.`,
  type: "signup",
  icon: "🟢",
});
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
// ======================================
// VERIFY EMAIL OTP
// ======================================

export const verifyOtp = async (req, res) => {
  try {
    const { userId, otp } = req.body;

    if (!userId || !otp) {
      return res.status(400).json({
        success: false,
        message: "User ID and OTP are required",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: "Email already verified",
      });
    }

    if (!user.otp || !user.otpExpires) {
      return res.status(400).json({
        success: false,
        message: "OTP not found. Request a new one.",
      });
    }

    if (new Date(user.otpExpires).getTime() < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "OTP expired. Request a new one.",
      });
    }

    if ((user.otpAttempts || 0) >= 5) {
      return res.status(429).json({
        success: false,
        message: "Too many incorrect attempts. Request a new OTP.",
      });
    }

    if (String(user.otp) !== String(otp)) {
      user.otpAttempts = (user.otpAttempts || 0) + 1;

      await user.save();

      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    // Email verified successfully.
    user.isVerified = true;

    // Move user to the next registration stage.
    user.registrationStatus = "pending_identity";

    // Clear OTP.
    user.otp = null;
    user.otpExpires = null;
    user.otpAttempts = 0;

    await user.save();

    const token = generateToken(user._id);

    return res.status(200).json({
  success: true,
  message: "Email verified successfully",
  token: generateToken(user._id),
  registrationStatus: user.registrationStatus,
  nextStep: "/enter-bvn",
  user: {
    _id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    profileImage: user.profileImage,
    registrationStatus: user.registrationStatus,
  },
});
  } catch (error) {
    console.error("VERIFY OTP ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to verify OTP",
    });
  }
};
// ======================================
// CONTINUE INCOMPLETE REGISTRATION
// ======================================


export const resumeRegistration = async (req, res) => {
  const genericResponse = {
    success: true,
    message:
      "If an eligible registration exists, a verification code will be sent.",
  };

  try {
    const email = String(req.body?.email || "")
      .trim()
      .toLowerCase();

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email address is required",
      });
    }

    const user = await User.findOne({ email });

    // Do not reveal whether an account exists.
    if (!user) {
      console.log("Registration recovery: no eligible account");
      return res.status(200).json(genericResponse);
    }

    // Already verified users should sign in.
    if (user.isVerified) {
      console.log("Registration recovery: account already verified");
      return res.status(200).json(genericResponse);
    }

    const now = Date.now();

    // Prevent repeated OTP requests.
    if (
      user.otpLastSentAt &&
      now - new Date(user.otpLastSentAt).getTime() < 60000
    ) {
      console.log("Registration recovery: OTP cooldown active");
      return res.status(200).json(genericResponse);
    }

    // Generate secure six-digit OTP.
    const otp = randomInt(100000, 1000000).toString();

    const otpExpiry = new Date(now + 5 * 60 * 1000);

    // Save OTP details.
    user.otp = otp;
    user.otpExpires = otpExpiry;
    user.otpAttempts = 0;
    user.otpLastSentAt = new Date(now);

    await user.save();

    // Escape user-controlled content for HTML.
    const escapeHtml = (value = "") =>
      String(value).replace(/[&<>"']/g, (char) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[char]);

    const userName = escapeHtml(user.name || "there");

    const text = `
Hello ${user.name || "there"},

Welcome back to Paylynk!

We received a request to continue your Paylynk registration.

YOUR VERIFICATION CODE

${otp}

This verification code expires in 5 minutes.

SECURITY INFORMATION

- Never share this code with anyone.
- Paylynk will never ask you for your OTP.
- This code is intended for your registration only.
- If you did not request this code, ignore this email.

Once your email has been verified, you can continue setting up your Paylynk account.

Thank you for choosing Paylynk.

The Paylynk Security Team
Your money. Your control. Your Paylynk.
`;

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport"
        content="width=device-width, initial-scale=1.0">
  <title>Continue Your Paylynk Registration</title>
</head>

<body style="
  margin:0;
  padding:0;
  background:#f1f5f9;
  font-family:Arial,Helvetica,sans-serif;
  color:#172033;
">

<table role="presentation"
       width="100%"
       cellpadding="0"
       cellspacing="0"
       border="0"
       style="background:#f1f5f9;padding:35px 12px;">

<tr>
<td align="center">

<table role="presentation"
       width="100%"
       cellpadding="0"
       cellspacing="0"
       border="0"
       style="
         max-width:600px;
         background:#ffffff;
         border-radius:16px;
       ">

<!-- BRAND HEADER -->

<tr>
<td align="center"
    style="
      background:#0b1c2d;
      padding:32px 25px;
      border-radius:16px 16px 0 0;
    ">

<h1 style="
  color:#ffffff;
  font-size:32px;
  font-weight:800;
  margin:0;
">
Paylynk<span style="color:#f97316;">.</span>
</h1>

<p style="
  color:#cbd5e1;
  font-size:13px;
  margin:10px 0 0;
">
Your money. Your control.
</p>

</td>
</tr>

<!-- EMAIL BODY -->

<tr>
<td style="padding:35px 30px;">

<p style="
  font-size:12px;
  color:#ea580c;
  font-weight:bold;
  letter-spacing:1px;
">
ACCOUNT VERIFICATION
</p>

<h2 style="
  color:#0b1c2d;
  font-size:26px;
  margin:12px 0 22px;
">
Continue Your Registration
</h2>

<p style="
  color:#475569;
  font-size:15px;
  line-height:1.8;
">
Hello ${userName},
</p>

<p style="
  color:#475569;
  font-size:15px;
  line-height:1.8;
">
Welcome back to Paylynk!
</p>

<p style="
  color:#475569;
  font-size:15px;
  line-height:1.8;
">
We received a request to continue setting up
your Paylynk account.

To proceed, please verify your email address
using the secure verification code below.
</p>

<!-- OTP BOX -->

<table role="presentation"
       width="100%"
       cellpadding="0"
       cellspacing="0"
       style="margin:30px 0;">

<tr>
<td align="center"
    style="
      background:#fff7ed;
      border:1px solid #fed7aa;
      border-radius:12px;
      padding:28px 15px;
    ">

<p style="
  margin:0 0 14px;
  color:#9a3412;
  font-size:13px;
  font-weight:bold;
">
YOUR VERIFICATION CODE
</p>

<h1 style="
  margin:0;
  color:#0b1c2d;
  font-size:38px;
  letter-spacing:8px;
  font-weight:800;
">
${otp}
</h1>

<p style="
  margin:16px 0 0;
  color:#9a3412;
  font-size:13px;
">
This code expires in 5 minutes.
</p>

</td>
</tr>
</table>

<p style="
  color:#475569;
  font-size:14px;
  line-height:1.8;
">
Enter this code on the Paylynk verification
page to continue your registration.
</p>

<!-- SECURITY NOTICE -->

<table role="presentation"
       width="100%"
       cellpadding="0"
       cellspacing="0"
       style="margin-top:25px;">

<tr>
<td style="
  background:#f8fafc;
  border-left:4px solid #f97316;
  padding:20px;
">

<h3 style="
  color:#0b1c2d;
  margin:0 0 12px;
  font-size:16px;
">
Important Security Information
</h3>

<p style="
  color:#64748b;
  font-size:13px;
  line-height:1.9;
  margin:0;
">
• Never share your verification code.<br>
• Paylynk will never request your OTP.<br>
• Your code expires after 5 minutes.<br>
• Only use this code on the official Paylynk website.
</p>

</td>
</tr>
</table>

<!-- UNREQUESTED EMAIL -->

<h3 style="
  color:#0b1c2d;
  margin-top:30px;
  font-size:16px;
">
Didn't request this email?
</h3>

<p style="
  color:#64748b;
  font-size:13px;
  line-height:1.8;
">
If you did not request to continue your
Paylynk registration, you can safely ignore
this email.

Your account will not be verified unless
the correct verification code is entered.
</p>

<p style="
  color:#475569;
  font-size:14px;
  margin-top:25px;
">
Thank you for choosing Paylynk.
</p>

<p style="
  color:#0b1c2d;
  font-size:14px;
  font-weight:bold;
">
The Paylynk Security Team
</p>

</td>
</tr>

<!-- FOOTER -->

<tr>
<td align="center"
    style="
      background:#f8fafc;
      padding:25px;
      border-top:1px solid #e2e8f0;
      border-radius:0 0 16px 16px;
    ">

<p style="
  color:#64748b;
  font-size:12px;
  line-height:1.7;
">
This is an automated security notification
from Paylynk.
</p>

<p style="
  color:#94a3b8;
  font-size:11px;
">
&copy; ${new Date().getFullYear()} Paylynk.
All rights reserved.
</p>

</td>
</tr>

</table>

</td>
</tr>
</table>

</body>
</html>
`;

    // SEND EMAIL
    try {
      const emailResult = await sendEmail({
        to: user.email,
        subject: "Paylynk | Continue Your Registration",
        text,
        html,
      });

      if (!emailResult?.success) {
        throw new Error("Email service returned no delivery result");
      }

      console.log(
        "Registration recovery email accepted:",
        emailResult
      );

    } catch (emailError) {
      console.error(
        "Registration recovery email failed:",
        emailError
      );

      // Clear OTP cooldown so the user can retry.
      // Do not clear a newer OTP created by another request.
      await User.updateOne(
        {
          _id: user._id,
          otp,
        },
        {
          $unset: {
            otp: "",
            otpExpires: "",
            otpLastSentAt: "",
          },
        }
      );

      // Preserve the generic response.
      return res.status(200).json(genericResponse);
    }

    return res.status(200).json(genericResponse);

  } catch (error) {
    console.error(
      "RESUME REGISTRATION ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Unable to process registration recovery",
    });
  }
};


export const verifyResumeOtp = async (req, res) => {
  try {
    const email = String(req.body?.email || "")
      .trim()
      .toLowerCase();

    const otp = String(req.body?.otp || "").trim();

    // Validate inputs
    if (!email || !/^\d{6}$/.test(otp)) {
      return res.status(400).json({
        success: false,
        message: "A valid email and 6-digit OTP are required.",
      });
    }

    // Find account
    const user = await User.findOne({ email })
      .select(
        "+otp +otpExpires +otpAttempts"
      );

    if (!user || user.isVerified) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired verification code.",
      });
    }

    // Check OTP expiry
    if (
      !user.otp ||
      !user.otpExpires ||
      new Date(user.otpExpires).getTime() <= Date.now()
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired verification code.",
      });
    }

    // Limit incorrect attempts
    const attempts = Number(user.otpAttempts || 0);

    if (attempts >= 5) {
      return res.status(429).json({
        success: false,
        message:
          "Too many incorrect attempts. Request a new code.",
      });
    }

    // Timing-safe OTP comparison
    const submittedHash = crypto
      .createHash("sha256")
      .update(otp)
      .digest();

    const storedHash = crypto
      .createHash("sha256")
      .update(String(user.otp))
      .digest();

    if (
      !crypto.timingSafeEqual(
        submittedHash,
        storedHash
      )
    ) {
      await User.updateOne(
        {
          _id: user._id,
          otp: user.otp,
          otpAttempts: { $lt: 5 },
        },
        {
          $inc: { otpAttempts: 1 },
        }
      );

      return res.status(400).json({
        success: false,
        message: "Invalid or expired verification code.",
      });
    }

    // Atomically consume OTP to prevent reuse
    const verifiedUser = await User.findOneAndUpdate(
      {
        _id: user._id,
        isVerified: { $ne: true },
        otp: user.otp,
        otpExpires: { $gt: new Date() },
        otpAttempts: { $lt: 5 },
      },
      {
        $set: {
          isVerified: true,
        },
        $unset: {
          otp: "",
          otpExpires: "",
          otpAttempts: "",
          otpLastSentAt: "",
        },
      },
      {
        new: true,
      }
    );

    if (!verifiedUser) {
      return res.status(400).json({
        success: false,
        message:
          "Verification code has expired or was already used.",
      });
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not configured");
    }

    // Create authentication token
    const token = jwt.sign(
      {
        id: verifiedUser._id.toString(),
        role: "user",
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    // Default next registration step
    const nextStep = "/enter-bvn";

    return res.status(200).json({
      success: true,
      message: "Email verified successfully.",
      token,
      nextStep,
      user: {
        _id: verifiedUser._id,
        name: verifiedUser.name,
        email: verifiedUser.email,
        phone: verifiedUser.phone,
        isVerified: verifiedUser.isVerified,
        role: verifiedUser.role || "user",
      },
    });

  } catch (error) {
    console.error("VERIFY RESUME OTP ERROR:", error);

    return res.status(500).json({
      success: false,
      message:
        "Unable to verify your registration code.",
    });
  }
};





// ========================
// LOGIN
// ========================
// LOGIN USER
// ========================


export const loginUser = async (req, res) => { 
  console.log("🔥 LOGIN CONTROLLER REACHED");
  try { 
    const { login, password } = req.body; 
 
    // 🔥 VALIDATE INPUTS 
    if (!login || !password) { 
      return res.status(400).json({ 
        success: false, 
        message: "Email/Phone and password are required", 
      }); 
    } 
 
    // 🔥 CLEAN INPUT 
    const cleanLogin = login.trim(); 
 
    // 🔥 FIND USER BY EMAIL OR PHONE 
    const user = await User.findOne({ 
      $or: [ 
        { email: cleanLogin.toLowerCase() }, 
        { phone: cleanLogin }, 
      ], 
    }); 
 
    // 🔥 USER NOT FOUND 
    if (!user) { 
      return res.status(401).json({ 
        success: false, 
        message: "Invalid credentials", 
      }); 
    } 
 
    // 🔥 CHECK PASSWORD 
    const isMatch = await user.matchPassword(password); 
 
    if (!isMatch) { 
      return res.status(401).json({ 
        success: false, 
        message: "Invalid credentials", 
      }); 
    } 
 
    // 🔥 CHECK IF VERIFIED 
    if (!user.isVerified) { 
      return res.status(403).json({ 
        success: false, 
        message: "Verify your account first", 
      }); 
    } 

    user.isOnline = true; 
    user.lastSeen = new Date(); 
    await user.save(); 
     
    await logActivity({ 
      userId: user._id, 
      title: "User Login", 
      description: `${user.name} logged into PayLynk.`, 
      type: "login", 
      icon: "🔑", 
    }); 
     
    // 🔥 GENERATE TOKEN 
    const token = generateToken(user._id); 
    const registrationStatus =
  user.registrationStatus ||
  (user.isVerified ? "completed" : "pending_email");

let nextStep = "/dashboard";

switch (registrationStatus) {
  case "pending_bank":
    nextStep = "/select-bank";
    break;

  case "pending_identity":
    nextStep = "/enter-bvn";
    break;

  case "completed":
    nextStep = "/dashboard";
    break;

  default:
    nextStep = "/dashboard";
}
 
  return res.status(200).json({
  success: true,
  message: "Login successful",
  token,
  registrationStatus,
  nextStep,

  user: {
    _id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    username: user.username,
    role: user.role,
    profileImage: user.profileImage,
    registrationStatus,
  },
});
 
  } catch (error) { 
    console.error("LOGIN ERROR:", error); 
 
    res.status(500).json({ 
      success: false, 
        message: error.message,
    error: error.stack,
    }); 
  } 
};
export const logoutUser = async (req, res) => {
  try {
    req.user.isOnline = false;
    req.user.lastSeen = new Date();

    await req.user.save();
    await logActivity({
  userId: req.user._id,
  title: "User Logout",
  description: `${req.user.name} logged out.`,
  type: "logout",
  icon: "🚪",
});

    res.json({
      success: true,
      message: "Logged out successfully",
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // 🔥 Generate new OTP
    const otp = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    // 🔥 Save OTP directly
    user.otp = otp;

    user.otpExpires =
      Date.now() + 5 * 60 * 1000;

    await user.save();

    // 🔥 Send email
    const sent = await sendEmail({
      to: user.email,
      subject: "Your PayLynk OTP Code",
      text: `Your OTP is ${otp}`,
      html: `
        <div style="font-family: Arial;">
          <h2>PayLynk Verification</h2>
          <p>Your new OTP is:</p>
          <h1>${otp}</h1>
          <p>This code expires in 5 minutes.</p>
        </div>
      `,
    });

    if (!sent) {
      return res.status(500).json({
        message: "Failed to send OTP",
      });
    }

    console.log("NEW OTP:", otp);

    res.json({
      success: true,
      message: "OTP resent successfully",
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// =============================
// FORGOT PASSWORD
// =============================
// RESET PASSWORD
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    // 🔥 JUST SET PASSWORD
    user.password = password;

    // CLEAR RESET FIELDS
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Password reset successful",
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================
// FORGOT PASSWORD
// =====================================


export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // CHECK USER
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // GENERATE RESET TOKEN
    const resetToken = crypto.randomBytes(32).toString("hex");

    // HASH TOKEN (STORE IN DB)
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // SAVE TOKEN TO USER
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

    await user.save();

    // FRONTEND RESET LINK
    
    const frontendUrl = (
      process.env.FRONTEND_URL || "https://www.paylynkds.com"
    ).replace(/\/+$/, "");

    const resetUrl =
      `${frontendUrl}/reset-password/${resetToken}`;
    // EMAIL MESSAGE
    const message = `
Hello ${user.name || "there"},

We received a request to reset the password associated with your Paylynk account.

To choose a new password, open the secure link below:

${resetUrl}

IMPORTANT SECURITY INFORMATION

- This password reset link expires in 15 minutes.
- The link can only be used once.
- Never share this link with anyone.
- Paylynk will never ask you to disclose your password through email.
- If you did not request this password reset, you can safely ignore this message.

For your protection, your existing password will remain unchanged unless you complete the password reset process.

Thank you for choosing Paylynk.

The Paylynk Security Team
Your money. Your control. Your Paylynk.
`;

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Reset Your Paylynk Password</title>
</head>

<body style="
  margin: 0;
  padding: 0;
  background-color: #f1f5f9;
  font-family: Arial, Helvetica, sans-serif;
  color: #172033;
">

  <div style="
    display: none;
    max-height: 0;
    overflow: hidden;
    opacity: 0;
  ">
    Securely reset your Paylynk account password. This link expires in 15 minutes.
  </div>

  <table
    role="presentation"
    width="100%"
    cellspacing="0"
    cellpadding="0"
    border="0"
    style="background-color: #f1f5f9; padding: 35px 12px;"
  >
    <tr>
      <td align="center">

        <table
          role="presentation"
          width="100%"
          cellspacing="0"
          cellpadding="0"
          border="0"
          style="
            max-width: 600px;
            background-color: #ffffff;
            border-radius: 16px;
            overflow: hidden;
          "
        >

          <!-- BRAND HEADER -->
          <tr>
            <td style="
              background-color: #0b1c2d;
              padding: 30px 35px;
              text-align: center;
            ">
              <h1 style="
                margin: 0;
                color: #ffffff;
                font-size: 30px;
                font-weight: 800;
                letter-spacing: 1px;
              ">
                Paylynk<span style="color: #f97316;">.</span>
              </h1>

              <p style="
                margin: 9px 0 0;
                color: #cbd5e1;
                font-size: 13px;
              ">
                Your money. Your control.
              </p>
            </td>
          </tr>

          <!-- EMAIL CONTENT -->
          <tr>
            <td style="padding: 38px 35px 25px;">

              <p style="
                margin: 0 0 12px;
                color: #64748b;
                font-size: 14px;
              ">
                ACCOUNT SECURITY
              </p>

              <h2 style="
                margin: 0 0 18px;
                color: #0b1c2d;
                font-size: 27px;
                line-height: 1.3;
              ">
                Reset your password
              </h2>

              <p style="
                margin: 0 0 18px;
                color: #475569;
                font-size: 15px;
                line-height: 1.8;
              ">
                Hello ${escapeHtml(user.name || "there")},
              </p>

              <p style="
                margin: 0 0 18px;
                color: #475569;
                font-size: 15px;
                line-height: 1.8;
              ">
                We received a request to reset the password associated
                with your Paylynk account.
              </p>

              <p style="
                margin: 0 0 25px;
                color: #475569;
                font-size: 15px;
                line-height: 1.8;
              ">
                If you made this request, click the button below to
                securely create a new password and regain access to
                your account.
              </p>

              <!-- RESET BUTTON -->
              <table
                role="presentation"
                cellspacing="0"
                cellpadding="0"
                border="0"
                align="center"
                style="margin: 0 auto 25px;"
              >
                <tr>
                  <td
                    align="center"
                    bgcolor="#f97316"
                    style="border-radius: 9px;"
                  >
                    <a
                      href="${resetUrl}"
                      style="
                        display: inline-block;
                        padding: 16px 32px;
                        color: #ffffff;
                        font-size: 15px;
                        font-weight: bold;
                        text-decoration: none;
                        border-radius: 9px;
                      "
                    >
                      Reset My Password
                    </a>
                  </td>
                </tr>
              </table>

              <!-- EXPIRATION NOTICE -->
              <table
                role="presentation"
                width="100%"
                cellspacing="0"
                cellpadding="0"
                border="0"
                style="
                  background-color: #fff7ed;
                  border-left: 4px solid #f97316;
                  border-radius: 6px;
                "
              >
                <tr>
                  <td style="padding: 16px 18px;">

                    <p style="
                      margin: 0 0 8px;
                      color: #9a3412;
                      font-size: 14px;
                      font-weight: bold;
                    ">
                      Important: This link expires in 15 minutes.
                    </p>

                    <p style="
                      margin: 0;
                      color: #9a3412;
                      font-size: 13px;
                      line-height: 1.7;
                    ">
                      For your security, this link is intended for
                      one-time use. If it expires, you will need to
                      request another password reset.
                    </p>

                  </td>
                </tr>
              </table>

              <!-- FALLBACK LINK -->
              <p style="
                margin: 28px 0 10px;
                color: #475569;
                font-size: 13px;
                line-height: 1.7;
              ">
                If the button above does not work, copy and paste the
                following link into your browser:
              </p>

              <p style="
                margin: 0 0 25px;
                overflow-wrap: anywhere;
                word-break: break-word;
                font-size: 12px;
                line-height: 1.8;
              ">
                <a
                  href="${resetUrl}"
                  style="color: #ea580c;"
                >
                  ${resetUrl}
                </a>
              </p>

              <!-- SECURITY NOTICE -->
              <div style="
                border-top: 1px solid #e2e8f0;
                padding-top: 22px;
              ">

                <h3 style="
                  margin: 0 0 12px;
                  color: #0b1c2d;
                  font-size: 16px;
                ">
                  Didn't request this change?
                </h3>

                <p style="
                  margin: 0 0 12px;
                  color: #64748b;
                  font-size: 13px;
                  line-height: 1.8;
                ">
                  No action is required if you did not request a password
                  reset. Your password will remain unchanged unless
                  someone successfully completes the reset process.
                </p>

                <p style="
                  margin: 0;
                  color: #64748b;
                  font-size: 13px;
                  line-height: 1.8;
                ">
                  Never share your password or password reset link with
                  anyone. Paylynk will never ask you to send these
                  details to us by email.
                </p>

              </div>

            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="
              padding: 25px 30px;
              background-color: #f8fafc;
              text-align: center;
              border-top: 1px solid #e2e8f0;
            ">

              <p style="
                margin: 0 0 8px;
                color: #0b1c2d;
                font-size: 14px;
                font-weight: bold;
              ">
                The Paylynk Security Team
              </p>

              <p style="
                margin: 0 0 12px;
                color: #64748b;
                font-size: 12px;
                line-height: 1.7;
              ">
                Protecting your account is our priority.
              </p>

              <p style="
                margin: 0;
                color: #94a3b8;
                font-size: 11px;
                line-height: 1.7;
              ">
                This is an automated security message. Please do not
                reply directly to this email.
              </p>

              <p style="
                margin: 15px 0 0;
                color: #94a3b8;
                font-size: 11px;
              ">
                &copy; ${new Date().getFullYear()} Paylynk. All rights reserved.
              </p>

            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>
`;


    // SEND EMAIL WITH ERROR HANDLING
    try {
      const emailResult = await sendEmail({
        to: user.email,
  subject: "Password Reset Request",
  text: message,
  html: `<p>${message}</p>`,
      } );

      console.log("📧 Email sent result:", emailResult);
    } catch (emailError) {
      console.log("❌ Email failed:", emailError);

      return res.status(500).json({
        success: false,
        message: "Failed to send reset email",
      });
    }

    // SUCCESS RESPONSE
    return res.status(200).json({
      success: true,
      message: "Reset email sent successfully",
    });

  } catch (error) {
    console.log("❌ Forgot Password Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

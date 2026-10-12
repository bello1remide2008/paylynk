import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import { sendEmail } from "../services/emailService.js";
import { logActivity } from "../utils/activityLogger.js";
import { randomInt } from "node:crypto";

import crypto from "crypto";



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
  try {
    const email = String(req.body.email || "")
      .trim()
      .toLowerCase();

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email address is required",
      });
    }

    const user = await User.findOne({ email });

    // Generic response to avoid exposing whether an email is registered.
    const genericResponse = {
      success: true,
      message:
        "If an eligible registration exists, a verification code will be sent.",
    };

    if (!user) {
      return res.status(200).json(genericResponse);
    }

    // Users who already verified their email should sign in.
    // Their remaining registration steps will be handled after login.
    if (user.isVerified) {
      return res.status(200).json(genericResponse);
    }

    // Limit how frequently OTPs can be sent.
    const now = Date.now();

    if (
      user.otpLastSentAt &&
      now - new Date(user.otpLastSentAt).getTime() < 60 * 1000
    ) {
      return res.status(200).json(genericResponse);
    }

    // Generate secure OTP.
    const otp = randomInt(100000, 1000000).toString();

    user.otp = otp;
    user.otpExpires = new Date(now + 5 * 60 * 1000);
    user.otpAttempts = 0;
    user.otpLastSentAt = new Date(now);

    await user.save();

    const sent = await sendEmail({
      to: user.email,
      subject: "Continue Your Paylynk Registration",
      text: `Your Paylynk verification code is ${otp}. It expires in 5 minutes.`,
      html: `
        <div style="font-family:Arial,sans-serif;padding:20px">
          <h2>Continue Your Paylynk Registration</h2>
          <p>Use the following code to verify your email:</p>
          <h1 style="letter-spacing:6px">${otp}</h1>
          <p>This code expires in 5 minutes.</p>
          <p>If you didn't request this, you can ignore this email.</p>
        </div>
      `,
    });

    if (!sent) {
      console.error("Failed to send registration recovery OTP");

      return res.status(200).json(genericResponse);
    }

    return res.status(200).json(genericResponse);
  } catch (error) {
    console.error("RESUME REGISTRATION ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to process registration recovery",
    });
  }
};
export const verifyResumeOtp = async (req, res) => {
  try {
    const email = String(req.body.email || "")
      .trim()
      .toLowerCase();

    const otp = String(req.body.otp || "").trim();

    if (!email || !/^\d{6}$/.test(otp)) {
      return res.status(400).json({
        success: false,
        message: "Enter your email and a valid 6-digit OTP",
      });
    }

    const user = await User.findOne({
      email,
      isVerified: false,
    });

    if (!user || !user.otp || !user.otpExpires) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired verification code",
      });
    }

    if (new Date(user.otpExpires).getTime() < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired verification code",
      });
    }

    if ((user.otpAttempts || 0) >= 5) {
      return res.status(429).json({
        success: false,
        message: "Too many attempts. Request a new code.",
      });
    }

    if (String(user.otp) !== otp) {
      user.otpAttempts = (user.otpAttempts || 0) + 1;
      await user.save();

      return res.status(400).json({
        success: false,
        message: "Invalid or expired verification code",
      });
    }

    user.isVerified = true;
    user.registrationStatus = "pending_identity";
    user.otp = null;
    user.otpExpires = null;
    user.otpAttempts = 0;

    await user.save();

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
    console.error("VERIFY RESUME OTP ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to verify registration",
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

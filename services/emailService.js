import nodemailer from "nodemailer";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// ✅ Create transporter
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Use SSL
  family: 4,
auth: {
  user: process.env.EMAIL_USER,
  pass: process.env.EMAIL_PASS,
},
  tls: {
    // This fixes the "self-signed certificate in certificate chain" error
    rejectUnauthorized: false,
  },
});

// ✅ Verify connection
transporter.verify((error, success) => {
  if (error) {
    console.error("Transporter error: Check if EMAIL_USER and EMAIL_PASS are correct in .env");
    console.error("Error details:", error.message);
  } else {
    console.log("Email server is ready to send messages");
  }
});

// ✅ Send Email Function
export const sendEmail = async ({ to, subject, text, html }) => {
  try {
    const mailOptions = {
      from: `"PAYLYNK App" <${process.env.EMAIL_USER}>`,
      to,          // ✅ dynamic
      subject,     // ✅ dynamic
      text,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.messageId);
    return true;

  } catch (error) {
    console.error("Email send error:", error.message);
    return false;
  }
};

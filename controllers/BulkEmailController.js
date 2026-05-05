import User from "../models/User.js";
import { sendEmail } from "../utils/sendEmail.js";

export const sendBulkEmail = async (req, res) => {
  const { message } = req.body;

  try {
    const users = await User.find({}, "email"); // only emails

    let successCount = 0;
    let failCount = 0;

    for (const user of users) {
      if (!user.email) continue;

      const success = await sendEmail({
        to: user.email,
        subject: "Paylynk Notification",
        html: `
          <div style="font-family: Arial; padding: 20px;">
            <h2>Paylynk Update</h2>
            <p>${message}</p>
          </div>
        `,
      });

      if (success) successCount++;
      else failCount++;
    }

    res.json({
      success: true,
      sent: successCount,
      failed: failCount,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Bulk email failed" });
  }
};
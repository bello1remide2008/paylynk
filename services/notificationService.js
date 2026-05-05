import User from "../models/User.js";
import { sendEmail } from "./emailService.js";

export const sendSystemMessage = async (subject, message) => {
  const users = await User.find();

  for (let user of users) {
    await sendEmail({
      to: user.email,
      subject,
      text: message,
    });
  }

  console.log("System message sent to all users");
};
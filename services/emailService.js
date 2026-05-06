import dotenv from "dotenv";
dotenv.config();

import { Resend } from "resend";

/**
 * Resend client initialized with your API key from .env
 * Ensure your .env file contains: RESEND_API_KEY=re_your_actual_key
 */
const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Sends a transactional email using the verified paylynkds.com domain.
 * @param {Object} params - The email details.
 * @param {string|string[]} params.to - Recipient email address or array of addresses.
 * @param {string} params.subject - The email subject line.
 * @param {string} params.html - The HTML body content of the email.
 */
export const sendEmail = async ({ to, subject, html }) => {
  try {
    const { data, error } = await resend.emails.send({
      // Unlocked: Now using your verified custom domain
      from: "Paylynk <hello@paylynkds.com>", 
      to, 
      subject,
      html,
    });

    if (error) {
      // Logic for handling API-specific errors (e.g., invalid API key or rate limits)
      console.error("RESEND API ERROR:", error);
      return { success: false, error };
    }

    // Success: 'data' will contain the unique ID for the sent email
    console.log("EMAIL SENT SUCCESSFULLY ID:", data.id);
    return { success: true, messageId: data.id };

  } catch (err) {
    // Logic for handling network or unexpected system errors
    console.error("UNEXPECTED SERVER ERROR:", err);
    return { success: false, error: err.message };
  }
};

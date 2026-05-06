import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async ({ to, subject, html }) => {
  try {
    const response = await resend.emails.send({
      from: "Paylynk <onboarding@resend.dev>",
      to,
      subject,
      html,
    });

    console.log("EMAIL SENT:", response);
    return true;
  } catch (error) {
    console.error("RESEND ERROR:", error);
    return false;
  }
};

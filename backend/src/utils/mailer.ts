import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// Standard transporter setup. Configure inside your .env
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendAdminNotification = async (
  subject: string,
  htmlContent: string,
) => {
  try {
    if (!process.env.SMTP_USER || !process.env.ADMIN_EMAIL) {
      console.warn(
        "Mailer logic skipped: SMTP_USER or ADMIN_EMAIL is not configured.",
      );
      return;
    }

    await transporter.sendMail({
      from:
        process.env.SMTP_FROM ||
        `"Omnis Properties" <${process.env.SMTP_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject,
      html: htmlContent,
    });
    console.log(`Notification sent: ${subject}`);
  } catch (err) {
    console.error("Failed to safely dispatch admin notification:", err);
  }
};

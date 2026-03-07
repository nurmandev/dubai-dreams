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
  connectionTimeout: 5000, // Drop connection attempt after 5s
  greetingTimeout: 5000,
  socketTimeout: 5000,
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
  } catch (err: any) {
    if (err.code === "ETIMEDOUT" || err.code === "ESOCKETTIMEDOUT") {
      console.error(
        `[Mailer] Failed to send "${subject}": SMTP connection timed out. Check your .env SMTP variables.`,
      );
    } else {
      console.error(
        `[Mailer] Failed to send "${subject}":`,
        err.message || err,
      );
    }
  }
};

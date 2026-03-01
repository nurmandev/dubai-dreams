import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export const sendEmail = async (to: string, subject: string, html: string) => {
  const mailOptions = {
    from: `"OMNIS Security" <${process.env.GMAIL_USER}>`,
    to,
    subject,
    html,
  };

  return transporter.sendMail(mailOptions);
};

export const emailTemplates = {
  verification: (token: string) => `
    <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
      <h2>Verify Your Email</h2>
      <p>Please use the following token to verify your email address. This token expires in 15 minutes.</p>
      <div style="font-size: 24px; font-weight: bold; padding: 10px; background: #f4f4f4; display: inline-block;">
        ${token}
      </div>
      <p>If you didn't request this, please ignore this email.</p>
    </div>
  `,
  passwordReset: (token: string) => `
    <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
      <h2>Reset Your Password</h2>
      <p>You requested a password reset. Use the token below to proceed. Expires in 15 minutes.</p>
      <div style="font-size: 24px; font-weight: bold; padding: 10px; background: #f4f4f4; display: inline-block;">
        ${token}
      </div>
    </div>
  `,
  newDeviceLogin: (device: string, ip: string) => `
    <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
      <h2>New Login Detected</h2>
      <p>A new login was detected on your account.</p>
      <ul>
        <li><strong>Device:</strong> ${device}</li>
        <li><strong>IP Address:</strong> ${ip}</li>
      </ul>
      <p>If this wasn't you, please change your password immediately.</p>
    </div>
  `,
};

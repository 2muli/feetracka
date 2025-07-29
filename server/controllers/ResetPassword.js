import crypto from "crypto";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import { db } from "../connectDB.js";
dotenv.config();

export const sendResetEmail = async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ error: "Email is required" });

  const token = crypto.randomBytes(32).toString("hex");
  const resetLink = `http://localhost:5173/change-password/${token}`;
  const expiry = new Date(Date.now() + 3600000); // 1 hour

  try {
    await db.query(
      "UPDATE users SET reset_token = ?, reset_token_expiry = ? WHERE email = ?",
      [token, expiry, email]
    );

    // 🧪 Ethereal test account
    const testAccount = await nodemailer.createTestAccount();
    const transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });

    const info = await transporter.sendMail({
      from: '"FeeTracka" <no-reply@feetracka.com>',
      to: email,
      subject: "Reset Your Password",
      html: `<p>Click to reset your password:</p><a href="${resetLink}">${resetLink}</a>`,
    });

    console.log("Preview URL:", nodemailer.getTestMessageUrl(info)); // 🔍 See the email in browser

    return res.status(200).json({
      success: true,
      message: "Reset email sent (preview)",
      previewUrl: nodemailer.getTestMessageUrl(info),
    });
  } catch (err) {
    console.error("Email error:", err);
    return res.status(500).json({ error: "Failed to send email" });
  }
};

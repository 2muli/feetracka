import crypto from "crypto";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import { db } from "../connectDB.js";

dotenv.config();

export const sendResetEmail = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  // Step 1: Generate a raw token and hash it for secure storage
  const rawToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");

  const expiry = new Date(Date.now() + 3600000); // 1 hour from now

  try {
    // Step 2: Save hashed token & expiry to the DB
    await db.query(
      "UPDATE users SET reset_token = ?, reset_token_expiry = ? WHERE email = ?",
      [hashedToken, expiry, email]
    );

    // Step 3: Create reset link (send raw token in URL)
    const resetLink = `${process.env.FRONTEND_URL}/change-password/${rawToken}`;

    // Step 4: Configure Gmail SMTP
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Step 5: Email content
    await transporter.sendMail({
      from: `"FeeTracka" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Reset Your Password - FeeTracka",
      text: `Hello,\n\nYou requested a password reset.\nClick this link: ${resetLink}\nIt will expire in 1 hour.\nIf you didn’t request this, you can ignore this email.`,
      html: `
        <p>Hello,</p>
        <p>You requested a password reset. Click the button below:</p>
        <p>
          <a href="${resetLink}" style="background-color:#4CAF50;color:white;padding:10px 15px;text-decoration:none;border-radius:5px;">
            Reset Password
          </a>
        </p>
        <p>If you didn’t request this, you can safely ignore this email.</p>
        <p><strong>Note:</strong> This link expires in 1 hour.</p>
      `,
    });

    // Step 6: Always send same response (to protect identity)
    return res.status(200).json({
      success: true,
      message: "If the email exists, a reset link has been sent. Check your inbox.",
    });
  } catch (err) {
    console.error("Email error:", err);
    return res.status(500).json({ error: "Failed to send reset email" });
  }
};

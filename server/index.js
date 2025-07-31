import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import http from "http";
import { db } from "./connectDB.js";

// Route Imports
import feeRoutes from "./routes/feestructure.js";
import paymentRoutes from "./routes/payment.js";
import remedialRoutes from "./routes/remedial.js";
import remedialPaymentRoutes from "./routes/RemialPayment.js";
import resetPasswordRoutes from "./routes/resetPassword.js";
import studentRoutes from "./routes/students.js";
import userRoutes from "./routes/users.js";

// Load .env variables
dotenv.config();

// Create Express app and HTTP server
const app = express();
const server = http.createServer(app);

// Middleware setup
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("✅ Backend is running successfully on Render!");
});

// API routes
app.use("/server/fees", feeRoutes);
app.use("/server/remedials", remedialRoutes);
app.use("/server/payments", paymentRoutes);
app.use("/server/students", studentRoutes);
app.use("/server/remedialPayments", remedialPaymentRoutes);
app.use("/server/users", userRoutes);
app.use("/server/resetPassword", resetPasswordRoutes);

// Connect to DB
db.connect((err) => {
  if (err) {
    console.error("❌ DB connection failed:", err.message);
  } else {
    console.log("✅ Connected to MySQL database.");
  }
});

// Start server
const PORT = process.env.PORT || 8800;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

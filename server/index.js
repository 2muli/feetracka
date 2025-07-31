import express from "express";
import http from "http";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { db } from "./connectDB.js";

// Route Imports
import feeRoutes from "./routes/feestructure.js";
import paymentRoutes from "./routes/payment.js";
import remedialRoutes from "./routes/remedial.js";
import remedialPaymentRoutes from "./routes/RemialPayment.js";
import resetPasswordRoutes from "./routes/resetPassword.js";
import studentRoutes from "./routes/students.js";
import userRoutes from "./routes/users.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

const allowedOrigins = [
  "http://localhost:5173",
  "https://feetracka.vercel.app",
  "https://feetracka-muli-muthuis-projects.vercel.app",
  "https://feetracka-q54m8di4k-muli-muthuis-projects.vercel.app",
];

// Enhanced CORS configuration
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "x-access-token"],
  })
);

app.use(cookieParser(process.env.COOKIE_SECRET || 'default-secret'));
app.use(express.json());

// Public routes (no auth required)
app.use("/server/users", userRoutes); // Move before auth middleware

// Auth middleware for protected routes
app.use((req, res, next) => {
  // Skip auth for certain routes
  if (req.path.startsWith('/server/users/login') || 
      req.path.startsWith('/server/users/register')) {
    return next();
  }
  
  const token = req.cookies?.token || req.headers['x-access-token'];
  if (!token) {
    return res.status(401).json({ success: false, error: "Unauthorized - No token provided" });
  }
  next();
});

// Protected routes
app.use("/server/fees", feeRoutes);
app.use("/server/remedials", remedialRoutes);
app.use("/server/payments", paymentRoutes);
app.use("/server/students", studentRoutes);
app.use("/server/remedialPayments", remedialPaymentRoutes);
app.use("/server/resetPassword", resetPasswordRoutes);

// Error handling
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(err.status || 500).json({
    success: false,
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal Server Error'
  });
});

// MySQL Connection
db.connect((err) => {
  if (err) {
    console.error("❌ MySQL connection failed:", err.message);
  } else {
    console.log("✅ Connected to MySQL database.");
  }
});

const PORT = process.env.PORT || 8800;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

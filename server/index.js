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

// Load environment variables
dotenv.config();

// Initialize Express app and server
const app = express();
const server = http.createServer(app);

// Allow listed frontend origins
const allowedOrigins = [
  "http://localhost:5173",
  "https://feetracka.vercel.app",
  "https://feetracka-muli-muthuis-projects.vercel.app",
  "https://feetracka-q54m8di4k-muli-muthuis-projects.vercel.app",
];

// Enhanced CORS configuration
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    optionsSuccessStatus: 200
  })
);

// Middlewares
app.use(cookieParser(process.env.COOKIE_SECRET || 'default-secret'));
app.use(express.json());

// Health check route
app.get("/", (req, res) => {
  res.send("✅ Backend is running successfully!");
});

// API Routes
app.use("/server/fees", feeRoutes);
app.use("/server/remedials", remedialRoutes);
app.use("/server/payments", paymentRoutes);
app.use("/server/students", studentRoutes);
app.use("/server/remedialPayments", remedialPaymentRoutes);
app.use("/server/users", userRoutes);
app.use("/server/resetPassword", resetPasswordRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error'
  });
});

// MySQL Connection Check
db.connect((err) => {
  if (err) {
    console.error("❌ MySQL connection failed:", err.message);
  } else {
    console.log("✅ Connected to MySQL database.");
  }
});

// Start server
const PORT = process.env.PORT || 8800;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

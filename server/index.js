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

// Load environment variables
dotenv.config();

// Initialize app and server
const app = express();
const server = http.createServer(app);

// Configure allowed origins
const allowedOrigins = [
  "http://localhost:5173",
  "https://feetracka.vercel.app",
  "https://feetracka-*.vercel.app", // Wildcard for all Vercel preview URLs
  "https://feetracka-muli-muthuis-projects.vercel.app",
  "https://feetracka-pmihxfav4-muli-muthuis-projects.vercel.app",
  process.env.FRONTEND_URL
].filter(Boolean); // Remove any undefined values

// Enhanced CORS configuration
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      
      // Check if the origin is in the allowed list or matches a wildcard pattern
      const isAllowed = allowedOrigins.some(allowedOrigin => {
        if (allowedOrigin.includes('*')) {
          const regex = new RegExp(allowedOrigin.replace('*', '.*'));
          return regex.test(origin);
        }
        return allowedOrigin === origin;
      });

      if (isAllowed) {
        callback(null, true);
      } else {
        console.warn(`Blocked by CORS: ${origin}`);
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Accept",
      "Origin",
      "Access-Control-Request-Method",
      "Access-Control-Request-Headers"
    ],
    exposedHeaders: ["Set-Cookie", "Authorization"],
    optionsSuccessStatus: 200
  })
);

// Handle preflight requests
app.options('*', cors());

// Middleware
app.use(cookieParser());
app.use(express.json());

// Basic health route
app.get("/", (req, res) => {
  res.send("✅ Backend is running successfully on Render!");
});

// Routes
app.use("/server/fees", feeRoutes);
app.use("/server/remedials", remedialRoutes);
app.use("/server/payments", paymentRoutes);
app.use("/server/students", studentRoutes);
app.use("/server/remedialPayments", remedialPaymentRoutes);
app.use("/server/users", userRoutes);
app.use("/server/resetPassword", resetPasswordRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({
      success: false,
      error: 'CORS policy blocked this request'
    });
  }
  console.error('Server Error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal Server Error'
  });
});

// Connect DB
db.connect((err) => {
  if (err) {
    console.error("❌ Failed to connect to MySQL:", err.message);
  } else {
    console.log("✅ Connected to MySQL database.");
  }
});

// Start Server
const PORT = process.env.PORT || 8800;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import http from "http";
import { db } from "./connectDB.js";

// Load environment variables
dotenv.config();

// Create Express app and HTTP server
const app = express();
const server = http.createServer(app);

// === CORS Configuration ===
const allowedOrigins = [
  "http://localhost:5173",
  "https://feetracka.vercel.app",
  "https://feetracka-muli-muthuis-projects.vercel.app",
  "https://feetracka-pmihxfav4-muli-muthuis-projects.vercel.app",
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // Allow non-browser tools
      const allowed = allowedOrigins.some((allowedOrigin) => {
        if (allowedOrigin.includes("*")) {
          const regex = new RegExp(allowedOrigin.replace("*", ".*"));
          return regex.test(origin);
        }
        return allowedOrigin === origin;
      });
      if (allowed) return callback(null, true);
      console.warn(`Blocked by CORS: ${origin}`);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    optionsSuccessStatus: 200,
  })
);

// === Middleware ===
app.use(cookieParser());
app.use(express.json());

// === Health Check to prevent Render sleeping ===
app.get("/healthcheck", (req, res) => {
  res.send("✅ Backend is alive 💖");
});

// === Home route ===
app.get("/", (req, res) => {
  res.send("✅ Backend is running successfully on Render!");
});

// === Routes ===
import feeRoutes from "./routes/feestructure.js";
import paymentRoutes from "./routes/payment.js";
import remedialRoutes from "./routes/remedial.js";
import remedialPaymentRoutes from "./routes/RemialPayment.js";
import resetPasswordRoutes from "./routes/resetPassword.js";
import studentRoutes from "./routes/students.js";
import userRoutes from "./routes/users.js";

app.use("/server/fees", feeRoutes);
app.use("/server/payments", paymentRoutes);
app.use("/server/remedials", remedialRoutes);
app.use("/server/remedialPayments", remedialPaymentRoutes);
app.use("/server/resetPassword", resetPasswordRoutes);
app.use("/server/students", studentRoutes);
app.use("/server/users", userRoutes);

// === Error Handler ===
app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
});

// === Connect to DB ===
db.connect((err) => {
  if (err) {
    console.error("❌ MySQL connection error:", err.message);
  } else {
    console.log("✅ Connected to MySQL");
  }
});

// === Start Server ===
const PORT = process.env.PORT || 8800;
server.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});

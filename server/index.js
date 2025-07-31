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

// Initialize app and HTTP server
const app = express();
const server = http.createServer(app);

// Allow only specific frontend URLs
const allowedOrigins = [
  "http://localhost:5173", // local dev
  "https://feetracka.vercel.app", // main deployment
  "https://feetracka-muli-muthuis-projects.vercel.app", // vercel preview
];

// Setup CORS
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS: " + origin));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

// Middlewares
app.use(cookieParser());
app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.send("✅ Backend is running successfully on Render!");
});

// Register routes
app.use("/server/fees", feeRoutes);
app.use("/server/remedials", remedialRoutes);
app.use("/server/payments", paymentRoutes);
app.use("/server/students", studentRoutes);
app.use("/server/remedialPayments", remedialPaymentRoutes);
app.use("/server/users", userRoutes);
app.use("/server/resetPassword", resetPasswordRoutes);

// MySQL DB connection
db.connect((err) => {
  if (err) {
    console.error("❌ Failed to connect to MySQL:", err.message);
  } else {
    console.log("✅ Connected to MySQL database.");
  }
});

// Start server
const PORT = process.env.PORT || 8800;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

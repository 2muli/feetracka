import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import http from "http";
import { db } from "./connectDB.js";

// 🛣 Route Imports
import feeRoutes from "./routes/feestructure.js";
import paymentRoutes from "./routes/payment.js";
import remedialRoutes from './routes/remedial.js';
import remedialPaymentRoutes from "./routes/RemialPayment.js";
import resetPasswordRoutes from "./routes/resetPassword.js";
import studentRoutes from "./routes/students.js";
import userRoutes from "./routes/users.js";
// 🌿 Initialize App
dotenv.config();
const app = express();
const server = http.createServer(app);

// 🛡️ Middlewares
app.use(cors({
  origin: "http://localhost:5173", // ✅ frontend origin
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true // ✅ allows cookies with requests
}));

app.use(cookieParser());          // ✅ Enables reading cookies
app.use(express.json());          // ✅ Parses incoming JSON

// 📦 API Routes
app.use("/server/fees", feeRoutes);
app.use("/server/remedials",remedialRoutes);
app.use("/server/payments", paymentRoutes); 
app.use("/server/students", studentRoutes);
app.use("/server/remedialPayments",remedialPaymentRoutes);
app.use("/server/users", userRoutes);
app.use("/server/resetPassword", resetPasswordRoutes);
// 🛢️ Connect MySQL
db.connect((err) => {
  if (err) {
    console.error("❌ Error connecting to the database:", err.message);
  } else {
    console.log("✅ Connected to the MySQL database");
  }
});

// 🚀 Start Server
const PORT = process.env.PORT || 8800;
server.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});

import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import rateLimit from "express-rate-limit";
import helmet from "helmet";

import authRoutes from "./routes/authRoutes.js";
import complaintRoutes from "./routes/complaintRoutes.js";

dotenv.config();
const app = express();

/* =======================
   🔐 Security Middleware
======================= */

// Helmet adds security headers
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP
  message: "Too many requests, please try again later."
});
app.use(limiter);

// Restrict JSON payload size (prevent abuse)
app.use(express.json({ limit: "10kb" }));

// CORS (restrict if needed)
app.use(cors({
  origin: process.env.CLIENT_URL || "*",
  credentials: true
}));

// Static folder
app.use("/uploads", express.static("uploads"));

/* =======================
   🗄 Database Connection
======================= */

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.log("❌ Mongo error:", err));

/* =======================
   📦 Routes
======================= */

app.use("/api/auth", authRoutes);
app.use("/api/complaints", complaintRoutes);

/* =======================
   ❌ Global Error Handler
======================= */

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong" });
});

/* =======================
   🚀 Server
======================= */

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

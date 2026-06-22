import express from "express";
import dotenv from "dotenv";
import cors from "cors";


import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import accountRoutes from "./routes/accountRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import adminAuthRoutes from "./routes/adminAuthRoutes.js";
import paystackRoutes from "./routes/paystackRoutes.js";
import onePipeRoutes from "./routes/onePipeRoutes.js";


import { errorHandler } from "./middleware/errorMiddleware.js";

// 🔥 INIT
dotenv.config();
connectDB();

const app = express();

// 🔥 MIDDLEWARE
app.use(express.json());
app.use(cors({
  origin: 'https://www.paylynkds.com',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  
  credentials: true
}));
// 🔥 ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/accounts", accountRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/admin/auth", adminAuthRoutes);
app.use("/api/paystack", paystackRoutes);
app.use("/api/onePipe", onePipeRoutes);

// 🔥 ERROR HANDLER
app.use(errorHandler);

// 🔥 TEST ROUTE
app.get("/", (req, res) => {
  res.send("API running...");
});

// 🔥 START SERVER
app.listen(5000, "0.0.0.0", () => {
  console.log("Server running on port 5000");
});

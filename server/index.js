const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
const authRoutes = require("./routes/authRoutes");
const ticketRoutes = require("./routes/ticketRoutes");
const userRoutes = require("./routes/userRoutes");
require("dotenv").config();
require("./config/db");
const decryptPayload = require("./middleware/decryptPayload");
const { encryptData } = require("./utils/backendCrypto");
const { initializeTicketScheduler } = require("./utils/ticketScheduler");

const app = express();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(decryptPayload);

// 👇 serve uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// custom encrypted response helper
app.use((req, res, next) => {
  res.sendEncrypted = (data) => {
    const encrypted = encryptData(JSON.stringify(data));
    res.json({ payload: encrypted });
  };
  next();
});

app.use(cookieParser());

// main routes
app.use("/api/auth", authRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/users", userRoutes);

// start ticket scheduler + server
initializeTicketScheduler();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

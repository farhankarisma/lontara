const express = require("express");
const cors = require("cors");
require("dotenv").config();
const mlRoutes = require("./routes/ml.classification.routes");

const prisma = require("./config/prisma");

const app = express();
app.use(express.json());
app.use(cors());

app.get("/api/health", (req, res) => {
  res.json({ ok: true });
});

// Auth routes
const authRoutes = require("./routes/auth.routes");
app.use("/api/auth", authRoutes);

// Admin routes
const adminRoutes = require("./routes/admin.routes");
app.use("/api/admin", adminRoutes);

// Admin OAuth routes
const adminOAuthRoutes = require("./routes/admin.oauth.routes");
app.use("/api/admin", adminOAuthRoutes);

// ✅ User activation routes
const userActivationRoutes = require("./routes/user.activation.routes");
app.use("/api/user", userActivationRoutes);

// ✅ User Gmail OAuth routes
const userGmailOAuthRoutes = require("./routes/user.gmail.oauth.routes");
app.use("/api/user", userGmailOAuthRoutes);

// ✅ FIX THIS LINE - GANTI DARI "/api/emails" KE "/api/user/emails"
const userEmailRoutes = require("./routes/user.email.routes");
app.use("/api/user/emails", userEmailRoutes); // ← FIXED!

// ✅ ML routes
app.use("/api/ml", mlRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
  console.log(`✅ Email routes: /api/user/emails/*`);
});

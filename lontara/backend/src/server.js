const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();

app.use((req, res, next) => {
  console.log(
    "🔥 REQUEST MASUK:",
    req.method,
    req.originalUrl,
    "AUTH HEADER:",
    req.headers.authorization
  );
  next();
});

app.use(express.json());
app.use(cors());

// Serve file static agar jika nanti lampiran email diunduh, folder sudah siap
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Health Check Route
app.get("/api/health", (req, res) => {
  res.json({ ok: true, message: "Server is running properly" });
});

// Existing Auth Routes (Tetap Dipakai)
const authRoutes = require("./routes/auth.routes");
app.use("/api/auth", authRoutes);

// Existing Admin Routes (Tetap Dipakai)
const adminRoutes = require("./routes/admin.routes");
app.use("/api/admin", adminRoutes);

// Existing OAuth Google Integration Routes (Tetap Dipakai untuk koneksi Gmail)
const adminOAuthRoutes = require("./routes/admin.oauth.routes");
app.use("/api/admin/oauth", adminOAuthRoutes);

// Mail Management Routes (Sinkronisasi Gmail ke Sistem) baru*
const mailRoutes = require("./routes/mail.routes");
app.use("/api/mail", mailRoutes);


app.use((err, req, res, next) => {
  console.error("💥 ERROR:", err);
  res.status(500).json({ message: "Internal error", error: err?.message });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running at http://localhost:${PORT}`)
);

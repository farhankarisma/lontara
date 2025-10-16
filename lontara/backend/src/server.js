const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// CORS configuration untuk frontend Next.js
app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:3001"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api/health", (req, res) => {
  res.json({ ok: true });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}`)
);

const authRoutes = require("./routes/auth.routes");
app.use("/api/auth", authRoutes);

const adminRoutes = require("./routes/admin.routes");
app.use("/api/admin", adminRoutes);

const adminOAuthRoutes = require("./routes/admin.oauth.routes");
app.use("/api/admin", adminOAuthRoutes);

const testRoutes = require("./routes/test.routes.js");
app.use("/api/test", testRoutes);

// Mock auth routes untuk testing sementara
const mockAuthRoutes = require("./routes/mock-auth.routes.js");
app.use("/api/auth", mockAuthRoutes);

app.use(express.json());

const express = require('express');
require('dotenv').config();

const app = express();
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ ok: true });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));

const authRoutes = require('./routes/auth.routes');
app.use('/api/auth', authRoutes);

const adminRoutes = require('./routes/admin.routes');
app.use('/api/admin', adminRoutes);

const adminOAuthRoutes = require("./routes/admin.oauth.routes");
app.use("/api/admin", adminOAuthRoutes);

app.use(express.json());

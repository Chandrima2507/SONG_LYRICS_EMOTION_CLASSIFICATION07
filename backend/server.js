const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const { connectDB } = require("./db");
const { apiLimiter } = require("./middleware/rateLimiter");
const { errorHandler, notFoundHandler } = require("./middleware/error.middleware");

// Routes
const authRoutes = require("./routes/auth.routes");
const analysisRoutes = require("./routes/analysis.routes");
const playlistRoutes = require("./routes/playlist.routes");
const statsRoutes = require("./routes/stats.routes");

const app = express();
const PORT = process.env.PORT || 5000;

// Security & Parsing Middleware
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true, limit: "5mb" }));

// Rate Limiter on all /api routes
app.use("/api", apiLimiter);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "EmoLyrics Production API",
    version: "2.0.0",
    timestamp: new Date().toISOString()
  });
});

// Mount Routes
app.use("/api/auth", authRoutes);
app.use("/api", analysisRoutes);
app.use("/api/playlists", playlistRoutes);
app.use("/api/stats", statsRoutes);

// Static file serving for production build of React frontend
const frontendDistPath = path.join(__dirname, "../frontend/dist");
if (fs.existsSync(frontendDistPath)) {
  app.use(express.static(frontendDistPath));
  app.get("*", (req, res, next) => {
    if (req.originalUrl.startsWith("/api")) {
      return next();
    }
    res.sendFile(path.join(frontendDistPath, "index.html"));
  });
}

// 404 & Centralized Error Handler
app.use(notFoundHandler);
app.use(errorHandler);

// Start Server
async function startServer() {
  await connectDB();
  app.listen(PORT, "0.0.0.0", () => {
    console.log(` EmoLyrics API Server successfully listening on http://localhost:${PORT}`);
    console.log(` Health check: http://localhost:${PORT}/api/health`);
  });
}

startServer();

module.exports = app;

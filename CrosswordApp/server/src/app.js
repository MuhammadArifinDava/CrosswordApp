const express = require("express");
const cors = require("cors");
const path = require("path");
const { env } = require("./config/env");
const { authRoutes } = require("./routes/authRoutes");
const { usersRoutes } = require("./routes/usersRoutes");
const { crosswordRoutes } = require("./routes/crosswordRoutes");
const { scoreRoutes } = require("./routes/scoreRoutes");

const app = express();

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

const allowedOrigins = String(env.clientOrigin || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      
      // If allowedOrigins is empty/default, allow all (or specific logic)
      if (allowedOrigins.length === 0) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        // Optional: fail closed in production
        // callback(new Error('Not allowed by CORS'));
        // For now, keep permissive for easier dev/testing if origin matches
        console.warn(`CORS Warning: Origin ${origin} not in allowed list`, allowedOrigins);
        callback(null, true); // Still allow for now, but log warning. Change to false to block.
      }
    },
    credentials: true,
  })
);

app.get("/health", (_req, res) => {
  res.json({ ok: true, timestamp: new Date().toISOString() });
});

app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

// API Routes
app.use("/auth", authRoutes);
app.use("/users", usersRoutes);
app.use("/crosswords", crosswordRoutes);
app.use("/scores", scoreRoutes);

// Serve static files from client build (Production Mode)
if (process.env.NODE_ENV === 'production') {
    const clientBuildPath = path.join(__dirname, "../../client/dist");
    app.use(express.static(clientBuildPath));

    // Handle client-side routing by serving index.html for all non-API routes
    app.get("*", (req, res) => {
        res.sendFile(path.join(clientBuildPath, "index.html"));
    });
}

app.use((err, req, res, _next) => {
  console.error("Error encountered:", err);
  if (req.file) console.log("Uploaded file:", req.file);
  
  const status =
    err.code === "LIMIT_FILE_SIZE" || err.message.includes("Invalid file type")
      ? 400
      : err.status || 500;
  const message =
    status === 500 ? "Server error" : err.code === "LIMIT_FILE_SIZE" ? "File too large" : err.message;
  res.status(status).json({ message });
});

module.exports = { app };

const express = require("express");
const cors = require("cors");
const path = require("path");
const { env } = require("./config/env");
const { authRoutes } = require("./routes/authRoutes");
const { usersRoutes } = require("./routes/usersRoutes");
const { crosswordRoutes } = require("./routes/crosswordRoutes");
const { scoreRoutes } = require("./routes/scoreRoutes");

const fs = require("fs");

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

// CORS Configuration
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      
      // Check if allowedOrigins contains "*" or the specific origin
      if (allowedOrigins.includes("*") || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // Default to allowing for now to debug, but log warning
      console.warn(`CORS Warning: Origin ${origin} not in allowed list`, allowedOrigins);
      callback(null, true);
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
    
    // Only serve static files if the directory exists
    if (fs.existsSync(clientBuildPath)) {
        app.use(express.static(clientBuildPath));

        // Handle client-side routing by serving index.html for all non-API routes
        app.get("*", (req, res) => {
            res.sendFile(path.join(clientBuildPath, "index.html"));
        });
    } else {
        console.log("Client build not found, running in API-only mode.");
        
        // Add a default root route for API-only mode
        app.get("/", (req, res) => {
            res.json({ message: "Crossword API is running", version: "1.0.0" });
        });
    }
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

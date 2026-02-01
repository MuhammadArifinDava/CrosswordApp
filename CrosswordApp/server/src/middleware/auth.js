const jwt = require("jsonwebtoken");
const { env } = require("../config/env");
const { User } = require("../models/User");

async function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const [scheme, token] = header.split(" ");

  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    if (!env.jwtSecret) {
      env.require("JWT_SECRET");
    }
    const payload = jwt.verify(token, env.jwtSecret);
    
    // Verify if user still exists in DB
    const user = await User.findById(payload.id || payload._id);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized - User not found" });
    }

    req.user = user;
    return next();
  } catch (_err) {
    return res.status(401).json({ message: "Unauthorized" });
  }
}

module.exports = { requireAuth };

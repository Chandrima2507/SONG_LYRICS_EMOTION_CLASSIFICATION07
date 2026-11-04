const jwt = require("jsonwebtoken");
const { getIsConnected, memoryStore } = require("../db");
const User = require("../models/User");

const JWT_SECRET = process.env.JWT_SECRET || "emolyrics-super-secure-production-secret-key-2026";

async function authenticateJWT(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Authorization token missing or invalid format"
    });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (getIsConnected()) {
      const user = await User.findById(decoded.id).select("-password");
      if (!user) {
        return res.status(401).json({ success: false, message: "User no longer exists" });
      }
      req.user = user;
    } else {
      const user = memoryStore.users.find(u => u._id === decoded.id);
      if (!user) {
        return res.status(401).json({ success: false, message: "User no longer exists" });
      }
      req.user = user;
    }
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Session expired or invalid token. Please log in again."
    });
  }
}

// Optional Auth: if token exists, attach user, otherwise proceed anonymously
async function optionalJWT(req, res, next) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      if (getIsConnected()) {
        req.user = await User.findById(decoded.id).select("-password");
      } else {
        req.user = memoryStore.users.find(u => u._id === decoded.id);
      }
    } catch (e) {
      // Ignore token failure for optional endpoints
    }
  }
  next();
}

module.exports = {
  authenticateJWT,
  optionalJWT,
  JWT_SECRET
};

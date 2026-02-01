const jwt = require("jsonwebtoken");

function signToken(payload, secret, options = {}) {
  return jwt.sign(payload, secret, { expiresIn: "7d", ...options });
}

module.exports = { signToken };

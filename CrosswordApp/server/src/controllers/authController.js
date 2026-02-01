const bcrypt = require("bcrypt");
const { User } = require("../models/User");
const { env } = require("../config/env");
const { signToken } = require("../utils/jwt");

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function isEmailValid(email) {
  const value = String(email || "").trim().toLowerCase();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isUsernameValid(username) {
  const value = String(username || "").trim();
  if (value.length < 3 || value.length > 30) return false;
  return /^[a-zA-Z0-9_]+$/.test(value);
}

function isPasswordValid(password) {
  const value = String(password || "");
  return value.length >= 8 && value.length <= 72;
}

function signUserToken(user) {
  if (!env.jwtSecret) {
    env.require("JWT_SECRET");
  }
  return signToken(
    { id: String(user._id), username: user.username, email: user.email },
    env.jwtSecret
  );
}

async function register(req, res) {
  const name = String(req.body.name || "").trim();
  const username = String(req.body.username || "").trim();
  const email = normalizeEmail(req.body.email);
  const password = String(req.body.password || "");

  if (!username || !email || !password) {
    return res.status(400).json({ message: "Field required" });
  }

  if (!isUsernameValid(username)) {
    return res.status(400).json({ message: "Invalid username" });
  }

  if (!isEmailValid(email)) {
    return res.status(400).json({ message: "Invalid email" });
  }

  if (!isPasswordValid(password)) {
    return res.status(400).json({ message: "Invalid password" });
  }

  const existing = await User.findOne({ $or: [{ email }, { username }] });
  if (existing) {
    return res.status(409).json({ message: "User already exists" });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ name: name || username, username, email, passwordHash });
  const token = signUserToken(user);

  return res.status(201).json({ user: user.toJSON(), token });
}

async function login(req, res) {
  const email = normalizeEmail(req.body.email);
  const password = String(req.body.password || "");

  if (!email || !password) {
    return res.status(400).json({ message: "Field required" });
  }

  if (!isEmailValid(email)) {
    return res.status(400).json({ message: "Invalid email" });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = signUserToken(user);
  return res.json({ user: user.toJSON(), token });
}

async function logout(_req, res) {
  return res.json({ message: "OK" });
}

module.exports = { register, login, logout };

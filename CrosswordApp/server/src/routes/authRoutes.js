const express = require("express");
const { asyncHandler } = require("../utils/asyncHandler");
const { register, login, logout } = require("../controllers/authController");

const router = express.Router();

router.post("/register", asyncHandler(register));
router.post("/login", asyncHandler(login));
router.post("/logout", asyncHandler(logout));

module.exports = { authRoutes: router };

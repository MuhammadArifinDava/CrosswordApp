const express = require("express");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const { asyncHandler } = require("../utils/asyncHandler");
const { requireAuth } = require("../middleware/auth");
const { getMe, updateMyAvatar, getUserById } = require("../controllers/usersController");

const { upload } = require("../middleware/upload");

const router = express.Router();

router.get("/me", requireAuth, asyncHandler(getMe));
router.get("/:id", asyncHandler(getUserById));

router.post(
  "/me/avatar",
  requireAuth,
  upload.single("avatar"),
  asyncHandler(updateMyAvatar)
);

module.exports = { usersRoutes: router };

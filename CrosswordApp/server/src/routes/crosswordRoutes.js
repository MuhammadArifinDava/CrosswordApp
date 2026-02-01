const express = require("express");
const { requireAuth } = require("../middleware/auth");
const {
  generateCrossword,
  createCrossword,
  getCrosswords,
  getCrosswordById,
  getMyCrosswords
} = require("../controllers/crosswordController");

const router = express.Router();

// Public routes
router.get("/", getCrosswords);
router.get("/:id", getCrosswordById);

// Private routes
router.post("/generate", requireAuth, generateCrossword);
router.post("/", requireAuth, createCrossword);
router.get("/user/my", requireAuth, getMyCrosswords);

module.exports = { crosswordRoutes: router };

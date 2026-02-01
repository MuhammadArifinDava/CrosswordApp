const { asyncHandler } = require("../utils/asyncHandler");
const Crossword = require("../models/Crossword");
const CrosswordGenerator = require("../utils/crosswordGenerator");

// @desc    Generate a crossword puzzle
// @route   POST /crosswords/generate
// @access  Private (or Public if we want to allow guests)
exports.generateCrossword = asyncHandler(async (req, res) => {
  const { words } = req.body; // Array of { word, clue }
  
  if (!words || !Array.isArray(words) || words.length < 5) {
    return res.status(400).json({ message: "Please provide at least 5 words with clues." });
  }

  const generator = new CrosswordGenerator(words);
  const result = generator.generate();

  if (!result || result.placedCount < 2) {
    return res.status(400).json({ message: "Could not generate a valid crossword from these words. Try adding more connecting words." });
  }

  res.json({
    success: true,
    data: result
  });
});

// @desc    Save/Publish a crossword
// @route   POST /crosswords
// @access  Private
exports.createCrossword = asyncHandler(async (req, res) => {
  const { title, description, grid, clues, rows, cols, words, isPublished, difficulty } = req.body;

  const crossword = await Crossword.create({
    title,
    description,
    author: req.user._id,
    grid,
    clues,
    rows,
    cols,
    words,
    isPublished: isPublished || false,
    difficulty: difficulty || 'Medium'
  });

  res.status(201).json(crossword);
});

// @desc    Get all crosswords
// @route   GET /crosswords
// @access  Public
exports.getCrosswords = asyncHandler(async (req, res) => {
  const crosswords = await Crossword.find({ isPublished: true })
    .populate("author", "username")
    .sort("-createdAt");
  res.json(crosswords);
});

// @desc    Get user's crosswords (drafts and published)
// @route   GET /crosswords/my
// @access  Private
exports.getMyCrosswords = asyncHandler(async (req, res) => {
  const crosswords = await Crossword.find({ author: req.user._id })
    .sort("-createdAt");
  res.json(crosswords);
});

// @desc    Get single crossword
// @route   GET /crosswords/:id
// @access  Public
exports.getCrosswordById = asyncHandler(async (req, res) => {
  const crossword = await Crossword.findById(req.params.id).populate("author", "username");
  
  if (!crossword) {
    res.status(404);
    throw new Error("Crossword not found");
  }

  res.json(crossword);
});

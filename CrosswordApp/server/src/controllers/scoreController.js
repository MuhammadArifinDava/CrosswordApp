const Score = require('../models/Score');
const { asyncHandler } = require('../utils/asyncHandler');

const Crossword = require('../models/Crossword');

// @desc    Submit a score
// @route   POST /api/scores
// @access  Private
exports.submitScore = asyncHandler(async (req, res) => {
    const { crosswordId, userAnswers, timeSeconds, hintsUsed = 0 } = req.body;

    // Verify the solution server-side
    const crossword = await Crossword.findById(crosswordId);
    if (!crossword) {
        res.status(404);
        throw new Error('Crossword not found');
    }

    // Validate answers
    let isCorrect = true;
    for (let r = 0; r < crossword.rows; r++) {
        for (let c = 0; c < crossword.cols; c++) {
            const cell = crossword.grid[r][c];
            if (cell && cell.active) {
                const userChar = userAnswers?.[r]?.[c];
                if (!userChar || userChar.toUpperCase() !== cell.char) {
                    isCorrect = false;
                    break;
                }
            }
        }
        if (!isCorrect) break;
    }

    if (!isCorrect) {
        res.status(400);
        throw new Error('Invalid solution. Please ensure all answers are correct.');
    }

    // Calculate score securely
    // Base: 1000
    // Hints: -50 * hintsUsed
    // Time: -1 * timeSeconds
    let score = 1000 - (hintsUsed * 50) - timeSeconds;
    if (score < 0) score = 0;

    const newScore = await Score.create({
        user: req.user._id,
        crossword: crosswordId,
        score,
        timeSeconds
    });

    res.status(201).json(newScore);
});

// @desc    Get leaderboard for a crossword
// @route   GET /api/scores/:crosswordId
// @access  Public
exports.getLeaderboard = asyncHandler(async (req, res) => {
    const { crosswordId } = req.params;

    const scores = await Score.find({ crossword: crosswordId })
        .populate('user', 'username')
        .sort({ score: -1, timeSeconds: 1 }) // Highest score first, then lowest time
        .limit(10); // Top 10

    res.json(scores);
});

// @desc    Get user's high scores
// @route   GET /api/scores/user/me
// @access  Private
exports.getUserScores = asyncHandler(async (req, res) => {
    const scores = await Score.find({ user: req.user._id })
        .populate('crossword', 'title')
        .sort({ createdAt: -1 });

    res.json(scores);
});

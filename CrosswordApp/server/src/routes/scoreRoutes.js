const express = require('express');
const router = express.Router();
const { submitScore, getLeaderboard, getUserScores } = require('../controllers/scoreController');
const { requireAuth } = require('../middleware/auth');

router.post('/', requireAuth, submitScore);
router.get('/:crosswordId', getLeaderboard);
router.get('/user/me', requireAuth, getUserScores);

module.exports = { scoreRoutes: router };

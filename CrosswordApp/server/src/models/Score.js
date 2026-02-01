const mongoose = require('mongoose');

const scoreSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    crossword: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Crossword',
        required: true
    },
    score: {
        type: Number,
        required: true
    },
    timeSeconds: {
        type: Number,
        required: true
    },
    completedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Compound index to quickly query top scores for a specific crossword
scoreSchema.index({ crossword: 1, score: -1, timeSeconds: 1 });

module.exports = mongoose.model('Score', scoreSchema);

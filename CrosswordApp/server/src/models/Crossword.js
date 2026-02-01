const mongoose = require("mongoose");

const crosswordSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // The grid structure: 2D array or object
    // Storing as an object with cell data for flexibility
    grid: {
      type: [[
        {
          char: String,
          num: Number, // Clue number if this is the start of a word
          active: Boolean,
        }
      ]],
      required: true,
    },
    // Dimensions
    rows: { type: Number, required: true },
    cols: { type: Number, required: true },
    
    // Clues
    clues: {
      across: [
        {
          number: Number,
          clue: String,
          answer: String,
          row: Number,
          col: Number,
        }
      ],
      down: [
        {
          number: Number,
          clue: String,
          answer: String,
          row: Number,
          col: Number,
        }
      ]
    },
    
    // Original input words for reference
    words: [
      {
        word: String,
        clue: String,
      }
    ],
    
    isPublished: {
      type: Boolean,
      default: false,
    },
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard'],
      default: 'Medium'
    }
  },
  {
    timestamps: true,
  }
);

const Crossword = mongoose.model("Crossword", crosswordSchema);

module.exports = Crossword;

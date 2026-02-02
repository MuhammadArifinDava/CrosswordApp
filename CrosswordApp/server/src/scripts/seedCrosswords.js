require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const Crossword = require('../models/Crossword'); // Direct export
const { User } = require('../models/User'); // Named export

// If running from root of server, adjust path to .env
// We assume this script is run as: node src/scripts/seedCrosswords.js from server/ directory

const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;

if (!mongoUri) {
  console.error("❌ MONGO_URI is missing in environment variables.");
  console.log("Usage: MONGO_URI='...' node src/scripts/seedCrosswords.js");
  process.exit(1);
}

const sampleCrosswords = [
  {
    title: "Web Dev Basics",
    rows: 10,
    cols: 10,
    difficulty: "Easy",
    isPublished: true,
    grid: [], // Will be filled
    clues: {
      across: [
        { number: 1, clue: "Standard markup language for documents designed to be displayed in a web browser", answer: "HTML", row: 0, col: 0 },
        { number: 3, clue: "Cascading Style Sheets", answer: "CSS", row: 2, col: 0 },
        { number: 5, clue: "JavaScript runtime built on Chrome's V8 JavaScript engine", answer: "NODE", row: 4, col: 0 },
        { number: 7, clue: "A library for building user interfaces", answer: "REACT", row: 6, col: 0 }
      ],
      down: [
        { number: 1, clue: "Hypertext Transfer Protocol", answer: "HTTP", row: 0, col: 0 },
        { number: 2, clue: "Local Area Network", answer: "LAN", row: 0, col: 2 },
        { number: 4, clue: "Structured Query Language", answer: "SQL", row: 2, col: 2 },
        { number: 6, clue: "Document Object Model", answer: "DOM", row: 4, col: 3 }
      ]
    }
  },
  {
    title: "Animal Kingdom",
    rows: 10,
    cols: 10,
    difficulty: "Easy",
    isPublished: true,
    clues: {
      across: [
        { number: 1, clue: "King of the jungle", answer: "LION", row: 0, col: 0 },
        { number: 3, clue: "Striped big cat", answer: "TIGER", row: 2, col: 0 },
        { number: 5, clue: "Largest land animal", answer: "ELEPHANT", row: 4, col: 0 }
      ],
      down: [
        { number: 1, clue: "Long-necked safari animal", answer: "GIRAFFE", row: 0, col: 0 },
        { number: 2, clue: "Man's best friend", answer: "DOG", row: 0, col: 3 }
      ]
    }
  },
  {
    title: "World Capitals",
    rows: 12,
    cols: 12,
    difficulty: "Medium",
    isPublished: true,
    clues: {
      across: [
        { number: 1, clue: "Capital of France", answer: "PARIS", row: 0, col: 0 },
        { number: 4, clue: "Capital of Japan", answer: "TOKYO", row: 2, col: 0 },
        { number: 6, clue: "Capital of Italy", answer: "ROME", row: 4, col: 0 }
      ],
      down: [
        { number: 2, clue: "Capital of Spain", answer: "MADRID", row: 0, col: 2 },
        { number: 3, clue: "Capital of Germany", answer: "BERLIN", row: 0, col: 4 }
      ]
    }
  },
  {
    title: "Programming Languages",
    rows: 15,
    cols: 15,
    difficulty: "Hard",
    isPublished: true,
    clues: {
      across: [
        { number: 1, clue: "Language named after a snake", answer: "PYTHON", row: 0, col: 0 },
        { number: 4, clue: "Language known for its coffee cup logo", answer: "JAVA", row: 2, col: 0 },
        { number: 6, clue: "System programming language from Google", answer: "GOLANG", row: 4, col: 0 }
      ],
      down: [
        { number: 2, clue: "Scripting language for web pages", answer: "JAVASCRIPT", row: 0, col: 2 },
        { number: 3, clue: "Language used for statistical computing", answer: "R", row: 0, col: 5 }
      ]
    }
  }
];

// Helper to create a grid from clues
function createGridFromClues(rows, cols, clues) {
  const grid = Array(rows).fill(null).map(() => 
    Array(cols).fill(null).map(() => ({ char: '', active: false, num: null }))
  );

  clues.across.forEach(c => {
    grid[c.row][c.col].num = c.number;
    for (let i = 0; i < c.answer.length; i++) {
      if (c.col + i < cols) {
        grid[c.row][c.col + i].char = c.answer[i];
        grid[c.row][c.col + i].active = true;
      }
    }
  });

  clues.down.forEach(c => {
    if (grid[c.row][c.col].num === null) {
        grid[c.row][c.col].num = c.number;
    }
    for (let i = 0; i < c.answer.length; i++) {
      if (c.row + i < rows) {
        grid[c.row + i][c.col].char = c.answer[i];
        grid[c.row + i][c.col].active = true;
      }
    }
  });

  return grid;
}

async function seed() {
  try {
    console.log("🌱 Connecting to MongoDB...");
    await mongoose.connect(mongoUri);
    console.log("✅ Connected.");

    // Find or Create Admin User
    let adminUser = await User.findOne({ username: 'admin' });
    if (!adminUser) {
      // Try finding ANY user
      adminUser = await User.findOne({});
      if (!adminUser) {
          console.log("👤 Creating seed admin user...");
          adminUser = await User.create({
            username: 'admin',
            email: 'admin@example.com',
            passwordHash: 'seed_password_hash_123',
            name: 'System Admin'
          });
      }
    }
    console.log(`👤 Using author: ${adminUser.username} (${adminUser._id})`);

    console.log("🧹 Clearing existing crosswords...");
    await Crossword.deleteMany({});
    console.log("✅ Cleared.");

    console.log("📝 Preparing seed data...");
    const seeds = sampleCrosswords.map(cw => {
      return {
        ...cw,
        author: adminUser._id,
        grid: createGridFromClues(cw.rows, cw.cols, cw.clues)
      };
    });

    console.log("🚀 Inserting crosswords...");
    await Crossword.insertMany(seeds);
    console.log(`✅ Successfully seeded ${seeds.length} crosswords!`);

    process.exit(0);
  } catch (err) {
    console.error("❌ Seed failed:", err);
    process.exit(1);
  }
}

seed();

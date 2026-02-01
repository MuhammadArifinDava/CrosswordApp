const mongoose = require("mongoose");
const { User } = require("../src/models/User");
const Crossword = require("../src/models/Crossword");
const CrosswordGenerator = require("../src/utils/crosswordGenerator");
const bcrypt = require("bcrypt");

// Manually set env if not loaded
process.env.MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/minimalism";

// Word Lists
const webDevWords = [
  { word: "HTML", clue: "Bahasa markup standar web" },
  { word: "CSS", clue: "Bahasa untuk styling halaman web" },
  { word: "JAVASCRIPT", clue: "Bahasa pemrograman untuk interaktivitas web" },
  { word: "REACT", clue: "Library UI populer buatan Facebook" },
  { word: "NODE", clue: "Runtime JavaScript di sisi server" },
  { word: "API", clue: "Antarmuka penghubung aplikasi" },
  { word: "DATABASE", clue: "Tempat penyimpanan data persisten" },
  { word: "SERVER", clue: "Komputer yang melayani permintaan klien" },
  { word: "BROWSER", clue: "Aplikasi untuk membuka website" },
  { word: "HTTP", clue: "Protokol transfer data di web" },
  { word: "JSON", clue: "Format pertukaran data ringan" },
  { word: "GIT", clue: "Sistem kontrol versi kode" },
  { word: "DEBUG", clue: "Proses mencari kesalahan kode" },
  { word: "FRONTEND", clue: "Sisi aplikasi yang dilihat pengguna" },
  { word: "BACKEND", clue: "Sisi aplikasi di balik layar" }
];

const mathWords = [
  { word: "ADDITION", clue: "Process of calculating the total of two or more numbers" },
  { word: "SUBTRACTION", clue: "Process of taking one number away from another" },
  { word: "MULTIPLY", clue: "Obtain the product of two numbers" },
  { word: "DIVISION", clue: "Splitting into equal parts" },
  { word: "ZERO", clue: "The number representing nothing" },
  { word: "PRIME", clue: "Number divisible only by 1 and itself" },
  { word: "ALGEBRA", clue: "Branch of math using letters for numbers" },
  { word: "GEOMETRY", clue: "Branch of math dealing with shapes and sizes" },
  { word: "CALCULUS", clue: "Mathematical study of continuous change" },
  { word: "CIRCLE", clue: "Round shape with no corners" },
  { word: "TRIANGLE", clue: "Shape with three sides" },
  { word: "SQUARE", clue: "Shape with four equal sides" },
  { word: "INFINITY", clue: "Concept of something that never ends" },
  { word: "DECIMAL", clue: "Number system based on 10" },
  { word: "FRACTION", clue: "Part of a whole number" }
];

const reactWords = [
  { word: "COMPONENT", clue: "Building block of React UI" },
  { word: "HOOKS", clue: "Functions to use state in functional components" },
  { word: "STATE", clue: "Data managed within a component" },
  { word: "PROPS", clue: "Data passed from parent to child" },
  { word: "JSX", clue: "Syntax extension for JavaScript" },
  { word: "VIRTUALDOM", clue: "Lightweight copy of the real DOM" },
  { word: "RENDER", clue: "Process of displaying content" },
  { word: "EFFECT", clue: "Side effects in functional components" },
  { word: "CONTEXT", clue: "Way to pass data deeply through the tree" },
  { word: "REDUX", clue: "State management library" },
  { word: "ROUTER", clue: "Library for navigation" },
  { word: "FRAGMENT", clue: "Wrapper for multiple elements" },
  { word: "REF", clue: "Reference to a DOM element" },
  { word: "MEMO", clue: "Higher order component for performance" },
  { word: "KEY", clue: "Unique identifier for list items" }
];

const scienceWords = [
  { word: "PHOTOSYNTHESIS", clue: "Process used by plants to make food" },
  { word: "GRAVITY", clue: "Force that attracts a body toward the center of the earth" },
  { word: "ATOM", clue: "Basic unit of a chemical element" },
  { word: "MOLECULE", clue: "Group of atoms bonded together" },
  { word: "EVOLUTION", clue: "Process of change in all forms of life" },
  { word: "GALAXY", clue: "System of millions or billions of stars" },
  { word: "ECOSYSTEM", clue: "Biological community of interacting organisms" },
  { word: "DNA", clue: "Carrier of genetic information" },
  { word: "FOSSIL", clue: "Remains or impression of a prehistoric organism" },
  { word: "VOLCANO", clue: "Mountain or hill having a crater" },
  { word: "OCEAN", clue: "Vast body of salt water" },
  { word: "PLANET", clue: "Celestial body orbiting a star" },
  { word: "ENERGY", clue: "The capacity to do work" },
  { word: "CLIMATE", clue: "Weather conditions prevailing in an area" },
  { word: "BACTERIA", clue: "Microscopic living organisms" }
];

const historyWords = [
  { word: "PYRAMID", clue: "Monumental structure in Egypt" },
  { word: "EMPIRE", clue: "Extensive group of states or countries" },
  { word: "REVOLUTION", clue: "Forcible overthrow of a government" },
  { word: "DEMOCRACY", clue: "System of government by the whole population" },
  { word: "VIKING", clue: "Norse seafarers" },
  { word: "RENAISSANCE", clue: "Revival of art and literature" },
  { word: "INDUSTRIAL", clue: "Relating to or characterized by industry" },
  { word: "ANCIENT", clue: "Belonging to the very distant past" },
  { word: "WAR", clue: "State of armed conflict" },
  { word: "PHARAOH", clue: "Ruler in ancient Egypt" },
  { word: "SAMURAI", clue: "Member of a powerful military caste in feudal Japan" },
  { word: "KNIGHT", clue: "Man who served his sovereign or lord" },
  { word: "COLONY", clue: "Country or area under the full or partial political control of another country" },
  { word: "DYNASTY", clue: "Line of hereditary rulers" },
  { word: "PIRATE", clue: "Person who attacks and robs ships at sea" }
];

async function generateAndSavePuzzle(userId, title, description, words) {
  console.log(`Generating puzzle: ${title}...`);
  const generator = new CrosswordGenerator(words);
  const result = generator.generate();

  if (!result) {
    console.error(`Failed to generate puzzle: ${title}`);
    return;
  }

  // Delete existing puzzle with same title to update it
  await Crossword.deleteMany({ title: title });

  const puzzleData = {
    title,
    description,
    author: userId,
    rows: result.grid.length,
    cols: result.grid[0].length,
    grid: result.grid,
    clues: result.clues, // Generator returns { across: [], down: [] }
    words: result.placedWords,
    isPublished: true,
    createdAt: new Date()
  };

  await Crossword.create(puzzleData);
  console.log(`Successfully seeded: ${title} with ${result.placedCount} words.`);
}

async function seed() {
  try {
    console.log("Connecting to DB...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected.");

    // 1. Find or Create Admin User
    let user = await User.findOne({ email: "admin@example.com" });
    if (!user) {
      console.log("Creating admin user...");
      const passwordHash = await bcrypt.hash("password123", 10);
      user = await User.create({
        username: "Admin",
        email: "admin@example.com",
        passwordHash,
        avatarPath: "https://ui-avatars.com/api/?name=Admin&background=random"
      });
    }
    console.log("User ready:", user.username);

    // 2. Generate and Seed Puzzles
    await generateAndSavePuzzle(
      user._id, 
      "Web Dev Basics", 
      "Teka-teki silang seputar dasar pengembangan web.", 
      webDevWords
    );

    await generateAndSavePuzzle(
      user._id,
      "Simple Math",
      "Common mathematical terms and concepts.",
      mathWords
    );

    await generateAndSavePuzzle(
      user._id,
      "React Fundamentals",
      "Test your knowledge of the React library.",
      reactWords
    );

    await generateAndSavePuzzle(
      user._id,
      "Science & Nature",
      "Explore the wonders of the natural world.",
      scienceWords
    );

    await generateAndSavePuzzle(
      user._id,
      "World History",
      "A journey through time and civilizations.",
      historyWords
    );

    console.log("Seeding complete.");
    process.exit(0);
  } catch (err) {
    console.error("Error:", err);
    process.exit(1);
  }
}

seed();

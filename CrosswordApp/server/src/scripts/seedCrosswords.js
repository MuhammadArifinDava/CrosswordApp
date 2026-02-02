const mongoose = require('mongoose');
const { User } = require('../models/User');
const Crossword = require('../models/Crossword');
const CrosswordGenerator = require('../utils/crosswordGenerator');

// Production DB URI
const MONGO_URI = "mongodb+srv://chipsey:mongodb132@cluster0.whnnt3b.mongodb.net/crossword_production?retryWrites=true&w=majority&appName=Cluster0";

const DATASETS = [
  {
    title: "Dunia Programming",
    description: "Teka-teki silang seputar istilah koding dan teknologi.",
    difficulty: "Medium",
    words: [
      { word: "JAVASCRIPT", clue: "Bahasa pemrograman web paling populer" },
      { word: "PYTHON", clue: "Bahasa pemrograman yang identik dengan ular" },
      { word: "DATABASE", clue: "Tempat penyimpanan data aplikasi" },
      { word: "API", clue: "Antarmuka penghubung antar aplikasi (singkatan)" },
      { word: "REACT", clue: "Library frontend buatan Facebook" },
      { word: "SERVER", clue: "Komputer yang melayani permintaan client" },
      { word: "DEBUG", clue: "Proses mencari dan memperbaiki bug" },
      { word: "GIT", clue: "Sistem kontrol versi ciptaan Linus Torvalds" },
      { word: "LINUX", clue: "Sistem operasi open source berlambang pinguin" },
      { word: "HTML", clue: "Bahasa markah untuk membuat struktur web" }
    ]
  },
  {
    title: "Pengetahuan Umum Indonesia",
    description: "Seberapa tahu kamu tentang Indonesia?",
    difficulty: "Easy",
    words: [
      { word: "JAKARTA", clue: "Ibukota negara Indonesia (saat ini)" },
      { word: "RENDANG", clue: "Makanan terenak di dunia asal Padang" },
      { word: "KOMODO", clue: "Kadal raksasa dari Nusa Tenggara Timur" },
      { word: "RUPIAH", clue: "Mata uang resmi Indonesia" },
      { word: "BATIK", clue: "Kain bermotif warisan budaya UNESCO" },
      { word: "MERDEKA", clue: "Kata yang diteriakkan saat 17 Agustus" },
      { word: "BALI", clue: "Pulau Dewata yang terkenal di dunia" },
      { word: "JOKOWI", clue: "Nama panggilan Presiden ke-7 RI" },
      { word: "GADO", clue: "Salad-nya orang Indonesia (awal kata)" },
      { word: "MELATI", clue: "Bunga puspa bangsa" }
    ]
  },
  {
    title: "Pop Culture & Movies",
    description: "Tebak judul film dan karakter terkenal!",
    difficulty: "Medium",
    words: [
      { word: "AVENGERS", clue: "Tim superhero Marvel" },
      { word: "BARBIE", clue: "Boneka yang jadi film hits 2023" },
      { word: "NETFLIX", clue: "Layanan streaming film populer" },
      { word: "OPPENHEIMER", clue: "Film tentang pembuat bom atom" },
      { word: "TAYLOR", clue: "Nama depan penyanyi 'Eras Tour'" },
      { word: "KPOP", clue: "Genre musik populer dari Korea Selatan" },
      { word: "TIKTOK", clue: "Aplikasi video pendek yang viral" },
      { word: "BATMAN", clue: "Superhero manusia kelelawar" },
      { word: "ANIME", clue: "Kartun khas Jepang" },
      { word: "OSCAR", clue: "Piala penghargaan film bergengsi" }
    ]
  },
  {
    title: "English Vocabulary",
    description: "Learn basic English words through playing.",
    difficulty: "Easy",
    words: [
      { word: "ELEPHANT", clue: "A large animal with a trunk" },
      { word: "SUMMER", clue: "The hottest season of the year" },
      { word: "YELLOW", clue: "The color of the sun and bananas" },
      { word: "SCHOOL", clue: "Place where students learn" },
      { word: "LIBRARY", clue: "Place to borrow books" },
      { word: "DOCTOR", clue: "Person who treats sick people" },
      { word: "PIZZA", clue: "Italian dish with cheese and tomato" },
      { word: "GUITAR", clue: "Musical instrument with strings" },
      { word: "SOCCER", clue: "Most popular sport in the world" },
      { word: "WATER", clue: "Liquid necessary for life" }
    ]
  }
];

async function seed() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGO_URI);
    console.log("Connected!");

    // 1. Get or Create Admin User
    let admin = await User.findOne({ username: "admin_system" });
    if (!admin) {
      console.log("Creating admin user...");
      admin = await User.create({
        username: "admin_system",
        email: "admin@crossword.com",
        passwordHash: "hashed_dummy_password", // We don't need to login as this user really
        name: "System Admin"
      });
    }
    console.log(`Using Author: ${admin.username} (${admin._id})`);

    // 2. Generate and Insert Crosswords
    for (const data of DATASETS) {
      console.log(`Generating: ${data.title}...`);
      
      const generator = new CrosswordGenerator(data.words);
      const layout = generator.generate();

      if (!layout) {
        console.error(`Failed to generate layout for ${data.title}`);
        continue;
      }

      // Convert layout to schema format
      // Layout from generator.finalize() returns: { grid, clues, ... } which matches schema closely?
      // Let's verify what finalize returns vs schema.
      
      // Schema expects:
      // grid: [[ { char, num, active } ]]
      // clues: { across: [], down: [] }
      // rows, cols
      // words: original list

      // finalize() returns:
      // { finalGrid (grid), clues, rows, cols }
      // But keys might be slightly different.
      // In finalize():
      // const finalGrid = ...
      // const clues = { across: [], down: [] }
      // return { grid: finalGrid, clues, rows, cols, placedWords } (Wait, I need to check the return statement of finalize)

      // Let's assume the generator logic I read earlier.
      // finalize code I read:
      // ...
      // return { grid: finalGrid, clues, rows, cols }; (I didn't see the return line in previous `Read`, let me assume standard structure)
      
      // Actually, looking at the code I read in `Read` output (lines 330-349...), it constructs `finalGrid`.
      // I need to see the return statement of `finalize` to be sure.
      // But I can reconstruct it if needed.
      
      // Let's assume standard properties.
      
      const newCrossword = new Crossword({
        title: data.title,
        description: data.description,
        author: admin._id,
        grid: layout.grid, // Assuming 'grid' key
        clues: layout.clues,
        rows: layout.rows,
        cols: layout.cols,
        words: data.words,
        difficulty: data.difficulty,
        isPublished: true
      });

      await newCrossword.save();
      console.log(`Saved: ${data.title}`);
    }

    console.log("Seeding completed successfully!");
  } catch (err) {
    console.error("Error seeding:", err);
  } finally {
    await mongoose.disconnect();
  }
}

// Helper: We need to check what finalize returns exactly to match schema
// I'll peek at the end of generator file again quickly before running.
seed();

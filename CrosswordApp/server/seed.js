const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { User } = require("./src/models/User");
const { Post } = require("./src/models/Post");
const { Comment } = require("./src/models/Comment");
require("dotenv").config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/blog_platform";

const seedData = async () => {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGO_URI);
    console.log("Connected!");

    console.log("Clearing old data...");
    await User.deleteMany({});
    await Post.deleteMany({});
    await Comment.deleteMany({});

    console.log("Creating users...");
    const passwordHash = await bcrypt.hash("password123", 10);

    const users = await User.insertMany([
      { 
        name: "Arifin Dava", 
        username: "arifindava", 
        email: "arifin@example.com", 
        passwordHash,
        avatarPath: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80" 
      },
      { 
        name: "Sarah Miller", 
        username: "sarahm", 
        email: "sarah@example.com", 
        passwordHash,
        avatarPath: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80"
      },
      { 
        name: "David Chen", 
        username: "davidc", 
        email: "david@tech.com", 
        passwordHash,
        avatarPath: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80"
      },
      { 
        name: "Emily Watson", 
        username: "emilyart", 
        email: "emily@art.com", 
        passwordHash,
        avatarPath: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80"
      },
      { 
        name: "Marcus Aurelius", 
        username: "marcus", 
        email: "marcus@history.com", 
        passwordHash,
        avatarPath: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80"
      },
    ]);

    console.log(`${users.length} users created.`);

    console.log("Creating posts...");
    const postsData = [
      {
        title: "Revolusi AI: Peluang atau Ancaman?",
        category: "Tech",
        image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        content: `Kecerdasan Buatan (AI) telah mengubah lanskap teknologi dunia dengan kecepatan yang belum pernah terjadi sebelumnya. Dari ChatGPT hingga Midjourney, alat-alat ini bukan lagi sekadar mainan futuristik, tetapi telah menjadi bagian integral dari alur kerja profesional.

## Dampak pada Industri Kreatif
Para desainer dan penulis kini dihadapkan pada realitas baru. Apakah AI akan menggantikan mereka? Jawabannya mungkin tidak sesederhana "ya" atau "tidak". AI lebih berperan sebagai *co-pilot* yang meningkatkan produktivitas, bukan pengganti total kreativitas manusia.

> "AI tidak akan menggantikanmu. Seseorang yang menggunakan AI akan menggantikanmu."

### Apa yang Harus Dipersiapkan?
1. **Adaptabilitas**: Kemampuan untuk belajar alat baru dengan cepat.
2. **Pemikiran Kritis**: AI bisa salah, manusia harus menjadi editor terakhir.
3. **Kreativitas Strategis**: Fokus pada "mengapa" dan "apa", biarkan AI menangani "bagaimana".

Masa depan cerah bagi mereka yang mau beradaptasi.`,
        author: users[0]._id, // Arifin Dava
      },
      {
        title: "Seni Hidup Minimalis di Era Digital",
        category: "Lifestyle",
        image: "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        content: `Minimalisme bukan hanya tentang memiliki sedikit barang. Ini tentang memberi ruang pada hal-hal yang benar-benar penting. Di era notifikasi tanpa henti, minimalisme digital menjadi kebutuhan.

Cobalah untuk:
- Matikan notifikasi yang tidak esensial.
- Hapus aplikasi yang hanya membuang waktu.
- Tetapkan batasan waktu layar.

**Less clutter, more clarity.** Ketenangan pikiran adalah kemewahan baru.`,
        author: users[1]._id, // Sarah
      },
      {
        title: "Eksplorasi Keindahan Alam Indonesia",
        category: "Travel",
        image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        content: `Indonesia tidak pernah kehabisan pesona. Dari Raja Ampat hingga Labuan Bajo, setiap sudut negeri ini menawarkan keajaiban.

Perjalanan terakhir saya ke Sumba membuka mata saya tentang betapa kayanya budaya kita. Kain tenun ikat, rumah adat menara, dan senyum ramah penduduk lokal adalah harta yang tak ternilai.

*Jangan lupa membawa kamera, karena setiap momen di sini layak diabadikan.*`,
        author: users[0]._id, // Arifin Dava
      },
      {
        title: "Coding: Bahasa Masa Depan",
        category: "Tech",
        image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        content: `Memahami cara kerja komputer adalah *superpower* di abad 21. Tidak harus menjadi software engineer profesional, pemahaman dasar tentang algoritma dan logika pemrograman dapat membantu memecahkan masalah di bidang apa pun.

Mulailah dengan Python atau JavaScript. Sumber belajar gratis bertebaran di internet. Konsistensi adalah kuncinya.`,
        author: users[2]._id, // David
      },
      {
        title: "Work-Life Balance: Mitos atau Fakta?",
        category: "Career",
        image: "https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        content: `Bekerja keras itu penting, tapi istirahat itu produktif. Burnout bukanlah lencana kehormatan.

Tips menjaga keseimbangan:
1. Tetapkan jam kerja yang jelas.
2. Punya hobi di luar pekerjaan.
3. Tidur yang cukup.

Ingat, karier adalah maraton, bukan lari sprint.`,
        author: users[3]._id, // Emily
      },
      {
        title: "Fotografi Jalanan: Menangkap Momen Mentah",
        category: "Photography",
        image: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        content: `Jalanan adalah panggung teater tanpa naskah. Emosi, interaksi, dan cahaya berpadu dalam hitungan detik.

Tips untuk pemula:
- Gunakan lensa lebar (35mm atau 28mm).
- Jangan takut mendekat.
- Tunggu momen, jangan memburu.`,
        author: users[4]._id, // Marcus
      },
      {
        title: "Membangun Startup: Dari Ide ke Eksekusi",
        category: "Business",
        image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        content: `Ide itu murah, eksekusi itu mahal. Banyak orang punya ide "The Next Facebook", tapi sedikit yang mau begadang mengerjakannya.

Validasi ide kamu secepat mungkin. Buat MVP (Minimum Viable Product), lempar ke pasar, dan dengarkan feedback. Jangan jatuh cinta pada solusinya, tapi jatuh cintalah pada masalah yang ingin kamu selesaikan.`,
        author: users[0]._id, // Arifin Dava
      },
      {
        title: "Kesehatan Mental di Tempat Kerja",
        category: "Health",
        image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        content: `Kesehatan mental sama pentingnya dengan kesehatan fisik. Lingkungan kerja yang toksik dapat menghancurkan keduanya.

Jika kamu merasa tertekan:
- Bicaralah dengan atasan atau HR.
- Ambil cuti untuk recharge.
- Cari bantuan profesional jika perlu.`,
        author: users[1]._id, // Sarah
      },
      {
        title: "Keajaiban Kopi Hitam",
        category: "Lifestyle",
        image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        content: `Bagi sebagian orang, kopi hanyalah kafein. Bagi saya, kopi adalah ritual. Aroma biji kopi yang baru digiling, suara air panas menyentuh bubuk kopi, dan rasa kompleks yang dihasilkan.

Cobalah single origin dari Ethiopia atau Gayo. Nikmati tanpa gula. Kamu akan menemukan dunia rasa baru.`,
        author: users[2]._id, // David
      }
    ];

    const posts = await Post.insertMany(postsData);
    console.log(`${posts.length} posts created.`);

    console.log("Creating comments...");
    const commentsData = [
      { content: "Artikel yang sangat membuka wawasan!", author: users[1]._id, post: posts[0]._id },
      { content: "Saya setuju, AI memang menakutkan tapi juga membantu.", author: users[4]._id, post: posts[0]._id },
      { content: "Terima kasih tipsnya! Langsung praktek.", author: users[0]._id, post: posts[1]._id },
      { content: "Jepang memang destinasi impian.", author: users[1]._id, post: posts[2]._id },
      { content: "React for the win!", author: users[2]._id, post: posts[3]._id },
      { content: "Saya lebih suka French Press, tapi boleh dicoba.", author: users[3]._id, post: posts[4]._id },
    ];

    await Comment.insertMany(commentsData);
    console.log(`${commentsData.length} comments created.`);

    console.log("Database seeded successfully!");
    process.exit(0);
  } catch (err) {
    console.error("Error seeding data:", err);
    process.exit(1);
  }
};

seedData();

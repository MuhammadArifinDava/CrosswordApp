# 🧩 Crossword Pro - The Ultimate TTS Experience

> *Project Fullstack MERN yang bikin bikin TTS semudah update status, dan main TTS se-asik scrolling TikTok.*

![MERN Stack](https://img.shields.io/badge/MERN-Stack-blue?style=for-the-badge) ![Vite](https://img.shields.io/badge/Vite-Fast-yellow?style=for-the-badge) ![Tailwind](https://img.shields.io/badge/Tailwind-CSS-teal?style=for-the-badge)

## Gambaran Umum (Overview)

Project ini dibuat untuk **Technical Test Fullstack Web & Game Developer**. Intinya, ini adalah platform *end-to-end* buat bikin dan main Teka-Teki Silang (Crossword). 

Gak cuma sekadar nampilin kotak-kotak, sistem ini punya **Algoritma Generator Cerdas** yang bisa nyusun kata-kata acak jadi grid TTS yang valid dalam hitungan milidetik. Plus, UI-nya udah dipoles pake **Tailwind CSS** + **Framer Motion** biar *experience*-nya smooth, support **Dark Mode**, dan responsif.

### Kenapa Project Ini "Gacor"?
- **Algoritma Pintar**: Gak asal random. Pake logika *heuristic* buat nyari intersek kata terbaik.
- **User Experience Juara**: Ada animasi, validasi real-time, timer, skor, dan sound effect.
- **Production Ready**: Udah diaudit, aman dari XSS, error handling rapi, dan siap deploy.

---

## Tech Stack 

Kita pake teknologi modern biar performa kenceng dan code-nya rapi.

### Frontend (Client)
- **React 19** + **Vite**: Kombinasi maut buat performa dan DX (*Developer Experience*).
- **Tailwind CSS**: Styling sat-set tanpa ninggalin HTML.
- **Framer Motion**: Buat animasi grid dan modal yang *satisfying*.
- **GSAP**: Buat animasi yang lebih kompleks (kalau ada).
- **Axios**: Buat ngobrol sama backend.

### Backend (Server)
- **Node.js** + **Express**: Backend ringan dan scalable.
- **MongoDB** + **Mongoose**: Database fleksibel buat nyimpen struktur grid JSON yang kompleks.
- **JWT (JSON Web Token)**: Buat autentikasi creator yang aman.

---

## ⚡ Fitur Utama

### 1. TTS Creator (Admin Panel)
Ini dapur pacunya. Creator bisa:
- **Input Kata & Clue**: Masukin daftar kata (minimal 5), sistem bakal validasi biar gak ada input kosong/aneh.
- **Magic Generate**: Klik satu tombol, algoritma bakal nyusun grid secara otomatis. Kalo gak puas, bisa generate ulang (ada 20 variasi permutasi!).
- **Preview & Publish**: Liat dulu hasilnya, kalo oke, simpan ke database dan dapet Link Unik.

### 2. TTS Player (Game Mode) 🎮
Halaman buat user main. Fiturnya:
- **Interactive Grid**: Klik cell, ketik jawaban, pindah pake arrow key. Rasanya kayak aplikasi native.
- **Smart Validation**: Cek jawaban bener/salah (bisa pake hint kalo nyerah).
- **Timer & Score**: Makin cepet kelar dan makin dikit pake hint, skor makin tinggi.
- **Dark Mode**: Otomatis ngikutin preferensi atau bisa di-toggle manual. Mata aman!

### 3. Share & Play 🔗
- Tiap puzzle punya **URL Unik** (misal: `/play/65a8...`).
- Share link ke grup WA/Telegram, temen lo bisa langsung main tanpa perlu login.

---

##  Bedah Algoritma (The Brain)

Bagian paling *tricky* tapi seru. Algoritma generator ada di `crosswordGenerator.js`.

**Cara Kerjanya:**
1.  **Sorting**: Kata-kata diurutkan dari yang **terpanjang**. Kenapa? Karena kata panjang lebih susah ditaruh belakangan (susah nyari tempat muat).
2.  **Placement Pertama**: Kata terpanjang ditaruh di tengah grid sebagai "tulang punggung".
3.  **Intersek & Cabang**: Kata berikutnya dicari huruf yang sama dengan kata yang udah ada di grid.
    -   *Contoh*: Kalo di grid ada "MAKAN", dan kata baru "NASI", dia bakal nyari huruf "N" atau "A" buat ditempel tegak lurus.
4.  **Validasi Posisi**: Sebelum ditaruh, sistem ngecek:
    -   Nabrak tembok grid gak?
    -   Nempel sama kata lain secara ilegal gak? (Isolasi tetangga).
5.  **Fallback**: Kalo gak nemu intersek, dia bakal nyoba taruh di tempat kosong yang muat (walaupun gak nyambung, biar semua kata masuk).
6.  **Permutasi**: Sistem nyoba **20x variasi** urutan kata secara random buat nyari grid yang paling padat dan saling terhubung.

---

##  Tantangan & Solusi (War Stories)

Selama development, ada beberapa "batu sandungan" yang udah kita beresin:

1.  **"Infinite Loop" saat Generate**:
    -   *Masalah*: Kadang kombinasi kata mustahil disusun, bikin browser hang.
    -   *Solusi*: Kita kasih batasan `attempts`. Kalo udah mentok, dia bakal berhenti dan kasih hasil terbaik yang ada, atau minta user revisi kata.

2.  **Input "Gak Ngotak"**:
    -   *Masalah*: User masukin emoji, spasi doang, atau kata 50 huruf.
    -   *Solusi*: Validasi ketat di Frontend & Backend. Spasi di-trim, non-alphanumeric dibuang, panjang kata dibatesin.

3.  **Deploy & Refresh (404 Error)**:
    -   *Masalah*: Pas deploy SPA (Single Page App), kalo refresh di halaman `/play/:id` malah 404.
    -   *Solusi*: Tambahin file `netlify.toml` atau konfigurasi server buat *redirect* semua request ke `index.html`.

---

##  Cara Menjalankan (Local Setup)

Mau coba di laptop sendiri? Gampang. Pastikan udah install **Node.js** dan **MongoDB**.

### 1. Clone Repository
```bash
git clone https://github.com/username/crossword-project.git
cd crossword-project
```

### 2. Setup Backend
```bash
cd CrosswordApp/server
cp .env.example .env  # Buat file .env
npm install           # Install dependencies
npm start             # Jalanin server (Port 5001)
```
*Pastikan MongoDB jalan di background!*

### 3. Setup Frontend
Buka terminal baru:
```bash
cd CrosswordApp/client
cp .env.example .env  # Pastikan VITE_API_URL mengarah ke backend
npm install
npm run dev           # Jalanin client (Port 5173)
```

Buka `http://localhost:5173` dan selamat bermain!

---

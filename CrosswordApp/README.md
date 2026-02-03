# Crossword Puzzle Generator & Player (Fullstack MERN)

Project Submission untuk **Technical Test – Fullstack Web & Game Developer**
**PT. Memento Game Studios**

---

##  Gambaran Umum
Aplikasi ini adalah platform Crossword (TTS) lengkap yang terdiri dari **Creator Studio** untuk membuat puzzle dan **Player Interface** untuk memainkannya. Dibangun menggunakan teknologi web modern untuk performa maksimal, aksesibilitas instan, dan pengalaman pengguna yang responsif di desktop maupun mobile.

### Kenapa Web Tech (React) dan bukan Unity?
Meskipun Unity sangat powerful untuk game berat, untuk studi kasus Crossword ini, Stack **React + Node.js** dipilih karena:
1.  **Superior Admin UI**: Pembuatan form input kata dan clue jauh lebih natural dan responsif di Web.
2.  **Instant Load**: Tidak perlu loading screen 20MB+ seperti WebGL.
3.  **SEO & Sharing**: Setiap puzzle memiliki URL unik yang bisa langsung dibuka dan diindeks.
4.  **Fullstack Demonstration**: Menunjukkan kemampuan merancang REST API, Database Schema, dan Frontend State Management yang kompleks.
5.  **"Gacor" Feel**: Menggunakan CSS 3D, Canvas Confetti, dan Web Audio API untuk memberikan "Game Feel" tanpa overhead engine berat.

---

##  Fitur Utama

### 1. TTS Creator / Admin Panel
*   **Auto-Generator Algoritma**: Cukup masukkan daftar kata & clue, sistem otomatis menyusun grid yang saling berpotongan (Interlocking).
*   **Preview Mode**: Lihat hasil grid sebelum publish.
*   **Validation**: Memastikan input tidak kosong dan valid.
*   **History**: Melihat daftar puzzle yang pernah dibuat.

### 2. TTS Player (Gacor Edition)
*   **Smart Input System**:
    *   *Skip Filled*: Cursor otomatis melompati kotak yang sudah terisi.
    *   *Smart Backspace*: Menghapus mundur dengan cerdas.
    *   *Smart Direction*: Klik kotak otomatis menentukan arah (Mendatar/Menurun) berdasarkan konteks.
*   **Immersive UI**:
    *   Target Cursor (Sniper Mode).
    *   Sound Effects (SFX) untuk setiap interaksi (Ketik, Benar, Salah, Menang).
    *   Confetti Celebration saat selesai.
    *   Dark Mode / Light Mode & Theme Store (Cyberpunk, Retro, dll).
*   **Mobile Friendly**: Layout otomatis berubah menjadi tab-based di layar kecil.

### 3. Akses & Share
*   **Unique URL**: `/play/:id` untuk membagikan puzzle.
*   **Leaderboard**: Sistem skor berdasarkan waktu dan penggunaan hint.
*   **Export PDF**: Cetak puzzle ke PDF siap print.

---

## 🛠 Tech Stack

**Frontend:**
*   **React (Vite)**: Framework UI utama.
*   **Tailwind CSS**: Styling utility-first untuk responsivitas cepat.
*   **Framer Motion**: Animasi UI yang halus.
*   **Zustand/Context**: State management.
*   **Axios**: Komunikasi API.

**Backend:**
*   **Node.js & Express**: RESTful API server.
*   **Mongoose**: ODM untuk MongoDB.
*   **Cors & Dotenv**: Security & Configuration.

**Database:**
*   **MongoDB**: Menyimpan data Puzzle (Grid structure) dan Score.

**Tools Tambahan:**
*   **jspdf**: Generate PDF.
*   **canvas-confetti**: Efek visual kemenangan.
*   **howler/Web Audio**: Sound engine.

---

##  Cara Menjalankan di Lokal

### Prasyarat
*   Node.js (v16+)
*   MongoDB (Running local atau Atlas URI)

### Langkah Instalasi

1.  **Clone Repository**
    ```bash
    git clone <repository_url>
    cd CrosswordApp
    ```

2.  **Setup Backend**
    ```bash
    cd server
    npm install
    # Buat file .env
    cp .env.example .env 
    # Pastikan MONGODB_URI di .env sesuai
    npm start
    ```
    *Server berjalan di http://localhost:5000*

3.  **Setup Frontend**
    ```bash
    cd client
    npm install
    npm run dev
    ```
    *Client berjalan di http://localhost:5173*

4.  **Buka Aplikasi**
    Buka browser dan akses `http://localhost:5173`.

---

## 🧠 Penjelasan Singkat Algoritma (Generator)

Algoritma penyusunan Crossword bekerja dengan pendekatan **Heuristic Backtracking**:

1.  **Sorting**: Kata-kata diurutkan dari yang terpanjang ke terpendek. Kata terpanjang ditempatkan pertama di tengah grid (biasanya Horizontal).
2.  **Placement Strategy**:
    *   Untuk setiap kata berikutnya, sistem mencari huruf yang cocok (match) dengan kata-kata yang sudah ada di grid.
    *   Jika ada huruf yang sama (misal 'A' di grid dan 'A' di kata baru), sistem mencoba menempatkan kata baru secara tegak lurus (Cross).
3.  **Validation**:
    *   Cek tabrakan: Apakah kata baru menimpa huruf lain yang tidak cocok?
    *   Cek isolasi: Apakah penempatan ini menciptakan kata-kata kecil 2 huruf yang tidak valid di sekitarnya?
4.  **Fallback**: Jika tidak ada posisi valid yang berpotongan, sistem akan mencoba menempatkan kata di posisi bebas (jika diizinkan) atau menyimpannya untuk iterasi berikutnya.

---

## ✨ Fitur Tambahan (Bonus)

1.  **Sistem Hint**: Pemain memiliki 3 kesempatan bantuan.
2.  **Leaderboard & Scoring**: Skor dihitung: `1000 - (Waktu * Faktor) - (Hint * 50)`.
3.  **Theme Store**: Pilihan tema visual (Default, Cyberpunk, Retro).
4.  **Export to PDF**: Fitur "Guru Mode" untuk mencetak soal.
5.  **Social Share**: Generate kartu skor gambar untuk dibagikan ke sosmed.

---

**Dibuat oleh:** Muhammad Arifin Dava
**Untuk:** Technical Test PT. Memento Game Studios

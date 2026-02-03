# 🧩 Crossword Pro - Technical Test Submission
> **Fullstack Web & Game Developer Technical Test**
> PT. Memento Game Studios

![MERN Stack](https://img.shields.io/badge/MERN-Stack-blue?style=for-the-badge) ![Vite](https://img.shields.io/badge/Vite-Fast-yellow?style=for-the-badge) ![Tailwind](https://img.shields.io/badge/Tailwind-CSS-teal?style=for-the-badge) ![Node.js](https://img.shields.io/badge/Node.js-Green?style=for-the-badge)

##  Gambaran Umum (Project Overview)

Aplikasi ini adalah platform **Crossword Generator & Player** *end-to-end* yang dibangun untuk memenuhi persyaratan Technical Test. Sistem ini memungkinkan pengguna untuk membuat Teka-Teki Silang (TTS) kustom hanya dengan memasukkan kata-kata, dan memainkannya secara interaktif.

Proyek ini dirancang dengan fokus pada:
1.  **Algoritma Generator**: Menyusun kata-kata acak menjadi grid yang valid dan saling terhubung.
2.  **User Experience (UX)**: Tampilan modern, responsif (mobile-friendly), dan interaktif.
3.  **Production Ready**: Validasi input ketat, keamanan (XSS protection), dan struktur kode yang scalable.

---

##  Tech Stack

Kami menggunakan teknologi modern untuk memastikan performa dan kemudahan pengembangan.

### Frontend (Client)
-   **React 19** + **Vite**: Framework UI cepat dan efisien.
-   **Tailwind CSS**: Utility-first CSS untuk styling yang konsisten dan responsif (termasuk Dark Mode).
-   **Framer Motion**: Untuk animasi transisi grid dan modal yang halus.
-   **Axios**: HTTP client untuk komunikasi dengan backend.
-   **Canvas Confetti**: Efek visual saat puzzle selesai.

### Backend (Server)
-   **Node.js** + **Express**: Runtime server yang ringan.
-   **MongoDB** + **Mongoose**: NoSQL Database untuk menyimpan struktur JSON puzzle yang dinamis.
-   **JWT (JSON Web Token)**: Autentikasi aman untuk Creator.
-   **Cors & Helmet**: Keamanan standar API.

---

##  Daftar Fitur (Features)

Sesuai ketentuan Technical Test, berikut adalah rincian fitur yang telah diimplementasikan:

### Fitur Utama (Mandatory)
1.  **Crossword Creator (Admin Panel)**
    -   Input dinamis untuk Kata & Clue (minimal 5 kata).
    -   **Smart Generator**: Algoritma otomatis menyusun grid dan mencari interseksi kata.
    -   **Preview Mode**: Melihat hasil grid sebelum disimpan.
    -   **Publishing**: Menyimpan puzzle ke database dan menghasilkan Link Unik.
    -   **Validation**: Mencegah input kosong, duplikat, atau karakter ilegal.

2.  **Crossword Player (Game Mode)**
    -   **Interactive Grid**: Navigasi keyboard (Arrow keys) dan mouse.
    -   **Clue List**: Daftar petunjuk Mendatar (Across) dan Menurun (Down) yang sinkron dengan grid.
    -   **Real-time Feedback**: Indikasi sel aktif dan status jawaban.
    -   **Completion Modal**: Notifikasi saat puzzle selesai dengan statistik.

3.  **Access & Share**
    -   **Unique URL**: Setiap puzzle memiliki ID unik (misal: `/play/65a8...`) yang bisa dishare.
    -   **Public Library**: Halaman depan (`/`) menampilkan daftar puzzle yang tersedia.

### 🌟 Fitur Tambahan (Bonus Features)
Kami menambahkan fitur-fitur berikut untuk meningkatkan nilai UX dan kompleksitas teknis:

1.  **Algoritma & Logika**
    -   **Disconnected Word Detection**: Sistem mendeteksi kata yang tidak bisa disambungkan dan memberikan peringatan (warning) alih-alih memaksa masuk grid terpisah.
    -   **Randomized Permutation**: Generator mencoba 20x variasi susunan untuk mencari grid terpadat.
    -   **Difficulty Indicator**: Otomatis menentukan tingkat kesulitan (Easy/Medium/Hard) berdasarkan ukuran grid dan jumlah kata.

2.  **User Experience (UX)**
    -   **Dark Mode**: Dukungan penuh tema gelap/terang (toggle manual).
    -   **Timer & Scoring System**: Skor berkurang seiring waktu dan penggunaan hint.
    -   **Hint System**: Bantuan huruf (mengurangi skor).
    -   **Export to PDF**: Fitur untuk mencetak puzzle ke format PDF (soal & kunci jawaban).
    -   **Responsive Design**: Layout menyesuaikan layar HP (Mobile) dan Desktop.

3.  **Sistem Lanjutan**
    -   **Leaderboard**: Mencatat skor tertinggi untuk setiap puzzle.
    -   **Auth System**: Login/Register untuk Creator (opsional, tamu tetap bisa main).

---

## 🧠 Pendekatan Teknis (Technical Approach)

### 1. Algoritma Generator (Constructive Heuristic)
Lokasi: [`crosswordGenerator.js`](file:///server/src/utils/crosswordGenerator.js)

Tantangan terbesar adalah menyusun kata acak menjadi grid yang valid. Kami menggunakan pendekatan heuristik:
1.  **Sorting**: Kata diurutkan berdasarkan panjang (Descending). Kata terpanjang menjadi "tulang punggung".
2.  **Placement**: Kata pertama diletakkan di tengah.
3.  **Intersection Search**: Kata berikutnya dicari huruf yang sama (common letter) dengan kata yang sudah ada di grid.
4.  **Validation**:
    -   Cek batas grid (Bounds).
    -   Cek tabrakan huruf (Collisions).
    -   Cek isolasi tetangga (Isolation) agar tidak membentuk kata 2 huruf ilegal.
5.  **Exclusion**: Jika kata benar-benar tidak bisa masuk (tidak ada huruf yang sama), kata tersebut **dikecualikan** dan user diberi peringatan, demi menjaga integritas grid (agar tidak terputus).

### 2. Struktur Monorepo
Proyek dipisah menjadi dua folder utama: `client` dan `server` dalam satu repositori untuk memudahkan manajemen, namun siap untuk deployment terpisah (Frontend -> Netlify, Backend -> Heroku).

---

## 💻 Cara Menjalankan di Lokal (How to Run)

Pastikan Anda sudah menginstall **Node.js** dan **MongoDB** di komputer Anda.

### 1. Clone Repository
```bash
git clone <repository_url>
cd Crossword
```

### 2. Setup Backend (Server)
```bash
cd CrosswordApp/server

# 1. Buat file .env dari contoh
cp .env.example .env

# 2. Install dependencies
npm install

# 3. Jalankan server (Default Port: 5001)
npm start
```
*Pastikan MongoDB service sudah berjalan di background!*

### 3. Setup Frontend (Client)
Buka terminal baru:
```bash
cd CrosswordApp/client

# 1. Buat file .env dari contoh
# Pastikan VITE_API_URL=http://localhost:5001/api
cp .env.example .env

# 2. Install dependencies
npm install

# 3. Jalankan client (Default Port: 5173)
npm run dev
```

### 4. Buka Aplikasi
Buka browser dan akses: `http://localhost:5173`

---

## 📝 Dokumentasi Masalah & Solusi

1.  **Masalah**: "Infinite Loop" saat generate kata yang sulit.
    -   **Solusi**: Memberikan batasan `maxAttempts` (20x). Jika gagal, sistem mengembalikan hasil terbaik parsial.
2.  **Masalah**: Kata "terputus" (pulau terpisah) yang merusak estetika TTS.
    -   **Solusi**: Memperbarui algoritma untuk menghapus fallback penempatan bebas. Hanya kata yang berpotongan yang dimasukkan.
3.  **Masalah**: Refresh halaman 404 pada deployment SPA (Netlify).
    -   **Solusi**: Menambahkan konfigurasi `_redirects` atau `netlify.toml` untuk mengarahkan semua rute ke `index.html`.

---

**Dibuat oleh:** Muhammad Arifin Dava
**Untuk:** Technical Test PT. Memento Game Studios

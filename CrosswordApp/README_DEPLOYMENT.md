# Deployment Guide: Crossword App (Netlify + Heroku)

Struktur proyek ini telah disesuaikan untuk deployment terpisah:
- **Frontend (Client)** -> Deployed ke **Netlify**.
- **Backend (Server)** -> Deployed ke **Heroku**.

## 1. Struktur Folder (Monorepo)

```
/CrosswordApp
  /client         -> Source code React (Frontend)
  /server         -> Source code Node.js/Express (Backend)
  package.json    -> Script root untuk Heroku
  Procfile        -> Instruksi start untuk Heroku
  netlify.toml    -> Konfigurasi build untuk Netlify
```

## 2. Deploy Backend ke Heroku

Heroku akan menghosting Node.js server. Karena kita menggunakan struktur monorepo, kita menggunakan `Procfile` di root untuk memberitahu Heroku cara menjalankan server.

**Langkah-langkah:**

1.  **Buat App di Heroku**:
    ```bash
    heroku create nama-app-anda
    ```

2.  **Set Environment Variables di Heroku**:
    Masuk ke Dashboard Heroku > Settings > Config Vars, atau via CLI:
    ```bash
    heroku config:set NODE_ENV=production
    heroku config:set CLIENT_ORIGIN=https://nama-app-netlify-anda.netlify.app
    # MONGODB_URI biasanya otomatis diset jika pakai addon mLab/Atlas
    # Jika pakai Atlas eksternal:
    heroku config:set MONGO_URI=mongodb+srv://...
    ```

3.  **Push ke Heroku**:
    ```bash
    git push heroku main
    ```
    *Heroku akan otomatis mendeteksi `package.json` di root, menginstall dependencies (termasuk server), dan menjalankan command di `Procfile` (`npm start --prefix server`).*

4.  **Cek Status**:
    Buka `https://nama-app-anda.herokuapp.com/health`. Harus return `{ ok: true }`.

## 3. Deploy Frontend ke Netlify

Netlify akan menghosting file statis React.

**Langkah-langkah:**

1.  **Hubungkan Repository ke Netlify**:
    - Pilih repo GitHub Anda.

2.  **Konfigurasi Build (Otomatis via `netlify.toml`)**:
    Netlify akan otomatis membaca file `netlify.toml` di root.
    - **Base directory**: `client`
    - **Build command**: `npm run build`
    - **Publish directory**: `dist`

3.  **Set Environment Variables di Netlify**:
    Masuk ke Site Settings > Environment Variables:
    - `VITE_API_URL`: `https://nama-app-heroku-anda.herokuapp.com` (URL Backend Heroku Anda)
    - `NODE_ENV`: `production`

4.  **Deploy**:
    Klik "Trigger deploy".

## 4. Catatan Penting

- **CORS**: Backend sudah dikonfigurasi untuk menerima request dari `CLIENT_ORIGIN`. Pastikan Anda men-set variabel ini di Heroku agar frontend Netlify bisa mengakses API.
- **Database**: Pastikan MongoDB Anda (Atlas) mengizinkan koneksi dari IP manapun (`0.0.0.0/0`) atau whitelist IP Heroku (sulit karena dinamis).
- **Socket.IO**: Heroku mendukung WebSocket secara native, jadi fitur multiplayer aman.

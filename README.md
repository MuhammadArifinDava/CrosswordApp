# Memento Crossword Generator

A full-stack MERN (MongoDB, Express, React, Node.js) application for generating, playing, and sharing crossword puzzles.

## Features
- **Crossword Creator**: Automated grid generation algorithm
- **Interactive Player**: Smooth, app-like experience with keyboard/touch support
- **Multiplayer (New)**: Real-time collaboration with cursor presence and live updates
- **Difficulty Rating**: Easy/Medium/Hard indicators
- **Responsive Design**: Works on Desktop and Mobile
- **Themes**: Dark/Light mode support

## Tech Stack
- **Frontend**: React, Tailwind CSS, Framer Motion, Socket.io-client
- **Backend**: Node.js, Express, MongoDB, Socket.io
- **Deployment**: Netlify (Frontend) + Heroku (Backend)

## Deployment Guide
See [README_DEPLOYMENT.md](./CrosswordApp/README_DEPLOYMENT.md) for detailed instructions.

### 1. Frontend (Netlify/Vercel)
- Build Command: `npm run build`
- Output Directory: `dist`
- Environment Variables:
  - `VITE_API_URL`: Your backend URL (e.g., `https://your-backend.onrender.com`)

### 2. Backend (Render/Railway/Heroku)
- Build Command: `npm install`
- Start Command: `npm start`
- Environment Variables:
  - `MONGO_URI`: Your MongoDB Connection String
  - `JWT_SECRET`: Secret key for authentication
  - `NODE_ENV`: Set to `production`

## API Endpoints

### Auth
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Login

### Crosswords
- `POST /api/crosswords/generate` - Generate grid layout
- `POST /api/crosswords` - Publish puzzle
- `GET /api/crosswords` - List public puzzles
- `GET /api/crosswords/:id` - Get puzzle details

### Scores
- `POST /api/scores` - Submit score
- `GET /api/scores/leaderboard/:id` - Get puzzle leaderboard

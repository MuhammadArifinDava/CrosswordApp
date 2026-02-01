import axios from "axios";

// Priority:
// 1. VITE_API_URL environment variable (set in Netlify/Vercel)
// 2. Default to localhost for development
let baseURL = import.meta.env.VITE_API_URL || "http://localhost:5001";

console.log("API Base URL:", baseURL); // Debug log for deployment

const api = axios.create({
  baseURL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export { api };

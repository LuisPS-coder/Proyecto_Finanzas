import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
  timeout: 60000,
  withCredentials: false,
  headers: {
    "Content-Type": "application/json",
  },
});

// Si hay token en localStorage, lo añade a cada petición
const token = localStorage.getItem("token");
if (token) {
  api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

export default api;


import axios from "axios";

const api = axios.create({
  baseURL: "https://proyecto-finanzas-mgiw.onrender.com/api",
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

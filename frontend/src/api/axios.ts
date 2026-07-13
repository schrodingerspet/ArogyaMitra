import axios from "axios";

const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL || "").trim();

const API = axios.create({
  baseURL: apiBaseUrl || "/api",
});

let cachedToken: string | null = localStorage.getItem("token");

// Update cached token on storage events for multi-tab sync
window.addEventListener("storage", (e) => {
  if (e.key === "token") cachedToken = e.newValue;
});

API.interceptors.request.use((config) => {
  if (cachedToken) config.headers.Authorization = `Bearer ${cachedToken}`;
  return config;
});

API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = import.meta.env.BASE_URL + "login";
    }
    return Promise.reject(err);
  }
);

export default API;

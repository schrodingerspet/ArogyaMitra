import axios from "axios";
import useAppStore from "../stores/useAppStore";

const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000").trim();

const api = axios.create({
  baseURL: apiBaseUrl,
});

// Cache token locally to prevent repeated Zustand store lookups
let cachedToken: string | null = useAppStore.getState().token;
useAppStore.subscribe((state) => {
  cachedToken = state.token;
});

/* Attach JWT automatically */
api.interceptors.request.use((config) => {
  if (cachedToken) {
    config.headers.Authorization = `Bearer ${cachedToken}`;
  }
  return config;
});

// Handle expired or invalid JWT tokens
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAppStore.getState().logout();
      window.location.href = import.meta.env.BASE_URL + "login";
    }
    return Promise.reject(error);
  }
);

export default api;
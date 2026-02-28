import { create } from "zustand";
import * as authApi from "../api/auth";

const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem("token"),
  loading: false,
  error: null,

  setError: (error) => set({ error }),

  register: async (data) => {
    set({ loading: true, error: null });
    try {
      await authApi.register(data);
      set({ loading: false });
      return true;
    } catch (err) {
      set({ loading: false, error: err.response?.data?.detail || "Registration failed" });
      return false;
    }
  },

  login: async (data) => {
    set({ loading: true, error: null });
    try {
      const res = await authApi.login(data);
      const token = res.data.access_token;
      localStorage.setItem("token", token);
      set({ token, loading: false });
      return true;
    } catch (err) {
      set({ loading: false, error: err.response?.data?.detail || "Login failed" });
      return false;
    }
  },

  fetchProfile: async () => {
    try {
      const res = await authApi.getProfile();
      set({ user: res.data });
    } catch {
      set({ user: null });
    }
  },

  updateProfile: async (data) => {
    set({ loading: true, error: null });
    try {
      const res = await authApi.updateProfile(data);
      set({ user: res.data, loading: false });
      return true;
    } catch (err) {
      set({ loading: false, error: err.response?.data?.detail || "Update failed" });
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    set({ user: null, token: null });
  },
}));

export default useAuthStore;

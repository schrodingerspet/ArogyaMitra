import { create } from "zustand";
import * as analyticsApi from "../api/analytics";

const useAnalyticsStore = create((set) => ({
  summary: null,
  weekly: null,
  weightTrend: null,
  streak: null,
  loading: false,

  fetchSummary: async () => {
    set({ loading: true });
    try {
      const res = await analyticsApi.getSummary();
      set({ summary: res.data, loading: false });
    } catch {
      set({ loading: false });
    }
  },

  fetchWeekly: async () => {
    try {
      const res = await analyticsApi.getWeekly();
      set({ weekly: res.data });
    } catch {}
  },

  fetchWeightTrend: async () => {
    try {
      const res = await analyticsApi.getWeightTrend();
      set({ weightTrend: res.data });
    } catch {}
  },

  fetchStreak: async () => {
    try {
      const res = await analyticsApi.getStreak();
      set({ streak: res.data });
    } catch {}
  },

  fetchAll: async () => {
    set({ loading: true });
    try {
      const [summary, weekly, weightTrend, streak] = await Promise.all([
        analyticsApi.getSummary(),
        analyticsApi.getWeekly(),
        analyticsApi.getWeightTrend(),
        analyticsApi.getStreak(),
      ]);
      set({
        summary: summary.data,
        weekly: weekly.data,
        weightTrend: weightTrend.data,
        streak: streak.data,
        loading: false,
      });
    } catch {
      set({ loading: false });
    }
  },
}));

export default useAnalyticsStore;

import { create } from "zustand";
import * as healthApi from "../api/health";

const useHealthStore = create((set) => ({
  assessments: [],
  latest: null,
  insights: null,
  loading: false,
  error: null,

  fetchAssessments: async () => {
    set({ loading: true });
    try {
      const res = await healthApi.getAssessments();
      set({ assessments: res.data, loading: false });
    } catch {
      set({ loading: false });
    }
  },

  fetchLatest: async () => {
    try {
      const res = await healthApi.getLatestAssessment();
      set({ latest: res.data });
    } catch {}
  },

  fetchInsights: async () => {
    try {
      const res = await healthApi.getInsights();
      set({ insights: res.data });
    } catch {}
  },

  createAssessment: async (data) => {
    set({ loading: true, error: null });
    try {
      const res = await healthApi.createAssessment(data);
      set({ loading: false, latest: res.data });
      return res.data;
    } catch (err) {
      set({ loading: false, error: err.response?.data?.detail || "Failed" });
      return null;
    }
  },

  deleteAssessment: async (id) => {
    try {
      await healthApi.deleteAssessment(id);
      set((s) => ({ assessments: s.assessments.filter((a) => a.id !== id) }));
      return true;
    } catch {
      return false;
    }
  },
}));

export default useHealthStore;

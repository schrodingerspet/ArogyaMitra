import { create } from "zustand";
import * as progressApi from "../api/progress";

const useProgressStore = create((set) => ({
  records: [],
  loading: false,
  error: null,

  fetchRecords: async () => {
    set({ loading: true });
    try {
      const res = await progressApi.getProgressRecords();
      set({ records: res.data, loading: false });
    } catch {
      set({ loading: false });
    }
  },

  createRecord: async (data) => {
    set({ loading: true, error: null });
    try {
      const res = await progressApi.createProgress(data);
      set((s) => ({ records: [...s.records, res.data], loading: false }));
      return res.data;
    } catch (err) {
      set({ loading: false, error: err.response?.data?.detail || "Failed" });
      return null;
    }
  },

  deleteRecord: async (id) => {
    try {
      await progressApi.deleteProgressRecord(id);
      set((s) => ({ records: s.records.filter((r) => r.id !== id) }));
      return true;
    } catch {
      return false;
    }
  },
}));

export default useProgressStore;

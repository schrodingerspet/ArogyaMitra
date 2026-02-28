import { create } from "zustand";
import * as nutritionApi from "../api/nutrition";

const useNutritionStore = create((set) => ({
  plans: [],
  currentPlan: null,
  meals: [],
  loading: false,
  generating: false,
  error: null,

  fetchPlans: async () => {
    set({ loading: true });
    try {
      const res = await nutritionApi.getNutritionPlans();
      set({ plans: res.data, loading: false });
    } catch {
      set({ loading: false });
    }
  },

  fetchPlan: async (id) => {
    set({ loading: true });
    try {
      const res = await nutritionApi.getNutritionPlan(id);
      set({ currentPlan: res.data, loading: false });
    } catch {
      set({ loading: false });
    }
  },

  fetchMeals: async (id) => {
    try {
      const res = await nutritionApi.getMeals(id);
      set({ meals: res.data });
    } catch {}
  },

  generatePlan: async (data) => {
    set({ generating: true, error: null });
    try {
      const res = await nutritionApi.generateNutrition(data);
      set({ generating: false });
      return res.data;
    } catch (err) {
      set({ generating: false, error: err.response?.data?.detail || "Generation failed" });
      return null;
    }
  },

  deletePlan: async (id) => {
    try {
      await nutritionApi.deleteNutritionPlan(id);
      set((s) => ({ plans: s.plans.filter((p) => p.id !== id) }));
      return true;
    } catch {
      return false;
    }
  },
}));

export default useNutritionStore;

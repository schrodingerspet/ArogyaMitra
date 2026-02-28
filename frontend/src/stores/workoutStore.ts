import { create } from "zustand";
import * as workoutApi from "../api/workouts";

const useWorkoutStore = create((set) => ({
  plans: [],
  currentPlan: null,
  exercises: [],
  loading: false,
  generating: false,
  error: null,

  fetchPlans: async () => {
    set({ loading: true });
    try {
      const res = await workoutApi.getWorkouts();
      set({ plans: res.data, loading: false });
    } catch {
      set({ loading: false });
    }
  },

  fetchPlan: async (id) => {
    set({ loading: true });
    try {
      const res = await workoutApi.getWorkout(id);
      set({ currentPlan: res.data, loading: false });
    } catch {
      set({ loading: false });
    }
  },

  fetchExercises: async (id) => {
    try {
      const res = await workoutApi.getExercises(id);
      set({ exercises: res.data });
    } catch {}
  },

  generatePlan: async (data) => {
    set({ generating: true, error: null });
    try {
      const res = await workoutApi.generateWorkout(data);
      set({ generating: false });
      return res.data;
    } catch (err) {
      set({ generating: false, error: err.response?.data?.detail || "Generation failed" });
      return null;
    }
  },

  deletePlan: async (id) => {
    try {
      await workoutApi.deleteWorkout(id);
      set((s) => ({ plans: s.plans.filter((p) => p.id !== id) }));
      return true;
    } catch {
      return false;
    }
  },
}));

export default useWorkoutStore;

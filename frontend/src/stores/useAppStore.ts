import { create } from "zustand";
import { persist } from "zustand/middleware";

/* =====================================================
   TYPES
===================================================== */

export type User = {
  id?: number;
  name?: string;
  email: string;
};

export type ChatMessage = {
  sender: "user" | "ai";
  text: string;
  timestamp?: number;
};

export type Workout = {
  id: number;
  title: string;
  description: string;
};

export type Nutrition = {
  id?: number;
  meal: string;
  calories?: number;
};

/* =====================================================
   GLOBAL STATE TYPE
===================================================== */

type AppState = {
  /* ---------- AUTH ---------- */
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;

  login: (user: User, token: string) => void;
  logout: () => void;

  /* ---------- WORKOUT ---------- */
  workouts: Workout[];
  setWorkouts: (workouts: Workout[]) => void;
  addWorkout: (workout: Workout) => void;

  /* ---------- NUTRITION ---------- */
  nutrition: Nutrition[];
  setNutrition: (data: Nutrition[]) => void;

  /* ---------- PROGRESS ---------- */
  progress: Record<string, any>;
  setProgress: (data: Record<string, any>) => void;

  /* ---------- AROMI CHAT ---------- */
  chatHistory: ChatMessage[];
  addMessage: (msg: ChatMessage) => void;
  clearChat: () => void;

  /* ---------- UI STATE ---------- */
  loading: boolean;
  setLoading: (value: boolean) => void;
};

/* =====================================================
   ZUSTAND STORE
===================================================== */

const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      /* ================= AUTH ================= */

      user: null,
      token: null,
      isAuthenticated: false,

      login: (user, token) =>
        set({
          user,
          token,
          isAuthenticated: true,
        }),

      logout: () =>
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          workouts: [],
          nutrition: [],
          progress: {},
          chatHistory: [],
        }),

      /* ================= WORKOUT ================= */

      workouts: [],

      setWorkouts: (workouts) =>
        set({
          workouts,
        }),

      addWorkout: (workout) =>
        set((state) => ({
          workouts: [...state.workouts, workout],
        })),

      /* ================= NUTRITION ================= */

      nutrition: [],

      setNutrition: (data) =>
        set({
          nutrition: data,
        }),

      /* ================= PROGRESS ================= */

      progress: {},

      setProgress: (data) =>
        set({
          progress: data,
        }),

      /* ================= CHAT ================= */

      chatHistory: [],

      addMessage: (msg) =>
        set((state) => ({
          chatHistory: [
            ...state.chatHistory,
            {
              ...msg,
              timestamp: Date.now(),
            },
          ],
        })),

      clearChat: () =>
        set({
          chatHistory: [],
        }),

      /* ================= UI ================= */

      loading: false,

      setLoading: (value) =>
        set({
          loading: value,
        }),
    }),
    {
      name: "arogyamitra-storage", // localStorage key
    }
  )
);

export default useAppStore;
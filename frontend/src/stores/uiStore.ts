import { create } from "zustand";

const SIDEBAR_KEY = "sidebar-collapsed";

const getInitialCollapsed = () => {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(SIDEBAR_KEY) === "true";
};

const useUiStore = create((set) => ({
  sidebarCollapsed: getInitialCollapsed(),
  mobileSidebarOpen: false,
  setSidebarCollapsed: (nextValue) =>
    set((state) => {
      const next = typeof nextValue === "function" ? nextValue(state.sidebarCollapsed) : nextValue;
      if (typeof window !== "undefined") {
        localStorage.setItem(SIDEBAR_KEY, String(next));
      }
      return { sidebarCollapsed: next };
    }),
  setMobileSidebarOpen: (nextValue) =>
    set((state) => ({
      mobileSidebarOpen:
        typeof nextValue === "function" ? nextValue(state.mobileSidebarOpen) : nextValue,
    })),
}));

export default useUiStore;

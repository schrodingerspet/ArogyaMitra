export type ThemeMode = "dark" | "light";

const THEME_STORAGE_KEY = "arogyamitra-theme";

const isThemeMode = (value: string | null): value is ThemeMode =>
  value === "dark" || value === "light";

const getSystemTheme = (): ThemeMode => {
  if (typeof window === "undefined") return "dark";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

export const resolveInitialTheme = (): ThemeMode => {
  if (typeof window === "undefined") return "dark";
  const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
  return isThemeMode(stored) ? stored : getSystemTheme();
};

export const applyTheme = (theme: ThemeMode) => {
  if (typeof document === "undefined") return;
  document.documentElement.setAttribute("data-theme", theme);
  document.documentElement.style.colorScheme = theme;
  if (typeof window !== "undefined") {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  }
};

export const initTheme = (): ThemeMode => {
  const theme = resolveInitialTheme();
  applyTheme(theme);
  return theme;
};

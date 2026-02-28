export const colorTokens = {
  background: "#071226",
  surface: "#0d1420",
  surfaceRaised: "#111b2b",
  surfaceOverlay: "#162236",
  textPrimary: "#E6EEF8",
  textSecondary: "#AAB7C3",
  textMuted: "#6B7785",
  primaryStart: "#00D1FF",
  primaryEnd: "#00A9D6",
  violet: "#9B5CFF",
  success: "#28C76F",
  warning: "#F6C84C",
  error: "#FF6B6B",
};

export const semanticColorTokens = {
  pageBackground: colorTokens.background,
  cardBackground: colorTokens.surface,
  cardRaisedBackground: colorTokens.surfaceRaised,
  overlayBackground: colorTokens.surfaceOverlay,
  textHeading: colorTokens.textPrimary,
  textBody: colorTokens.textSecondary,
  textHint: colorTokens.textMuted,
  actionPrimary: `linear-gradient(135deg, ${colorTokens.primaryStart}, ${colorTokens.primaryEnd})`,
  actionHighlight: colorTokens.violet,
  statusSuccess: colorTokens.success,
  statusWarning: colorTokens.warning,
  statusError: colorTokens.error,
};

export const spacingTokens = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  "2xl": 32,
  "3xl": 48,
};

export const radiusTokens = {
  sm: 8,
  md: 12,
  lg: 16,
};

export const elevationTokens = {
  subtle: "0 8px 24px rgba(4, 6, 12, 0.5)",
  hover: "0 14px 28px rgba(4, 6, 12, 0.62)",
  panel: "0 0 0 1px rgba(255, 255, 255, 0.02), 0 16px 40px rgba(4, 6, 12, 0.58)",
};

export const motionTokens = {
  fast: 150,
  base: 200,
  slow: 250,
  easing: "cubic-bezier(0.2, 0.8, 0.2, 1)",
};

export const layoutTokens = {
  sidebarExpanded: 240,
  sidebarCollapsed: 72,
  topbarHeight: 64,
  contentMax: 1280,
  gutters: 24,
};

export const breakpointTokens = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
};

import { Platform } from "react-native";

const tintColorLight = "#007AFF";
const tintColorDark = "#0A84FF";

export const Colors = {
  light: {
    text: "#1C1C1E",
    textSecondary: "#6C6C70",
    background: "#F9FAFB",
    tint: tintColorLight,
    icon: "#6C6C70",
    tabIconDefault: "#8E8E93",
    tabIconSelected: tintColorLight,

    // Semantic
    primary: "#007AFF",
    secondary: "#5E5CE6",
    tertiary: "#AF52DE",
    danger: "#FF3B30",
    success: "#34C759",
    warning: "#FF9500",
    info: "#0A84FF",
    completed: "#8E8E93",

    // Surfaces
    card: "#FFFFFF",
    cardSecondary: "#F2F3F5",
    surface: "#FFFFFF",
    surfaceVariant: "#F5F6FA",
    overlay: "rgba(0, 0, 0, 0.05)",

    // Borders
    border: "#E2E3E5",
    borderLight: "#F2F3F5",

    // Gradients
    gradientStart: "#007AFF",
    gradientEnd: "#5E5CE6",
    gradientSuccess: "#34C759",
    gradientSuccessEnd: "#30D158",
    gradientDanger: "#FF3B30",
    gradientDangerEnd: "#FF453A",
  },

  dark: {
    text: "#F2F2F7",
    textSecondary: "#9A9AA0",
    background: "#000000",
    tint: tintColorDark,
    icon: "#A1A1AA",
    tabIconDefault: "#A1A1AA",
    tabIconSelected: tintColorDark,

    // Semantic
    primary: "#0A84FF",
    secondary: "#5E5CE6",
    tertiary: "#BF5AF2",
    danger: "#FF453A",
    success: "#32D74B",
    warning: "#FF9F0A",
    info: "#64D2FF",
    completed: "#636366",

    // Surfaces
    card: "#1C1C1E",
    cardSecondary: "#2C2C2E",
    surface: "#1C1C1E",
    surfaceVariant: "#2C2C2E",
    overlay: "rgba(255, 255, 255, 0.05)",

    // Borders
    border: "#3A3A3C",
    borderLight: "#2C2C2E",

    // Gradients
    gradientStart: "#0A84FF",
    gradientEnd: "#5E5CE6",
    gradientSuccess: "#32D74B",
    gradientSuccessEnd: "#30D158",
    gradientDanger: "#FF453A",
    gradientDangerEnd: "#FF6961",
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: "system-ui",
    serif: "ui-serif",
    rounded: "ui-rounded",
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

export const Spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 };
export const BorderRadius = { sm: 8, md: 12, lg: 16 };
export const FontSize = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 24,
  xxl: 32,
  xxxl: 40,
};

export const Shadows = {
  none: {
    shadowColor: "transparent",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  small: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  medium: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 4,
  },
  large: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 8,
  },
  xlarge: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 12,
  },
};

export const AnimationDurations = {
  instant: 0,
  fast: 150,
  medium: 300,
  slow: 500,
  verySlow: 800,
};

export const Typography = {
  h1: {
    fontSize: FontSize.xxl,
    fontWeight: "700" as const,
    lineHeight: 48,
    letterSpacing: -0.5,
  },
  h2: {
    fontSize: FontSize.xxl,
    fontWeight: "700" as const,
    lineHeight: 40,
    letterSpacing: -0.3,
  },
  h3: {
    fontSize: FontSize.xl,
    fontWeight: "600" as const,
    lineHeight: 32,
    letterSpacing: -0.2,
  },
  h4: {
    fontSize: FontSize.lg,
    fontWeight: "600" as const,
    lineHeight: 24,
    letterSpacing: 0,
  },
  body: { fontSize: FontSize.md, fontWeight: "400" as const, lineHeight: 24 },
  bodyBold: {
    fontSize: FontSize.md,
    fontWeight: "600" as const,
    lineHeight: 24,
  },
  caption: {
    fontSize: FontSize.sm,
    fontWeight: "400" as const,
    lineHeight: 20,
  },
  captionBold: {
    fontSize: FontSize.sm,
    fontWeight: "600" as const,
    lineHeight: 20,
  },
  label: {
    fontSize: FontSize.xs,
    fontWeight: "500" as const,
    lineHeight: 16,
    letterSpacing: 0.5,
  },
};

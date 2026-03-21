import { ViewStyle, TextStyle } from "react-native";

export const colors = {
  // Brand — purple (thyroid awareness ribbon)
  primary: "#6B48CC",
  primaryDark: "#5236A8",
  primaryLight: "#EDE9FA",

  // Backgrounds
  background: "#FFFFFF",
  secondaryBackground: "#F7F6FC",

  // Text
  textPrimary: "#1A1A2E",
  textSecondary: "#6B7280",

  // UI chrome
  border: "#E8E5F0",
  white: "#FFFFFF",
  black: "#000000",
  error: "#EF4444",
  overlay: "rgba(0, 0, 0, 0.5)",

  // Verdict — muted, calm (not alarming)
  verdictSafe: "#2ECC71",
  verdictSafeBg: "#EAFAF1",
  verdictReview: "#D97706",
  verdictReviewBg: "#FEF3C7",
  verdictAvoid: "#DC4B4B",
  verdictAvoidBg: "#FEF0F0",
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  button: 14,
} as const;

export const cardStyle: ViewStyle = {
  backgroundColor: colors.white,
  borderRadius: borderRadius.lg,
  padding: spacing.md,
  shadowColor: colors.black,
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.08,
  shadowRadius: 8,
  elevation: 3,
};

export const buttonStyle: ViewStyle = {
  height: 56,
  borderRadius: borderRadius.button,
  backgroundColor: colors.primary,
  alignItems: "center",
  justifyContent: "center",
  paddingHorizontal: spacing.lg,
};

export const buttonTextStyle: TextStyle = {
  color: colors.white,
  fontSize: 18,
  fontWeight: "700",
};

export const typography = {
  h1: {
    fontSize: 28,
    fontWeight: "700" as const,
    color: colors.textPrimary,
  },
  h2: {
    fontSize: 22,
    fontWeight: "600" as const,
    color: colors.textPrimary,
  },
  h3: {
    fontSize: 18,
    fontWeight: "600" as const,
    color: colors.textPrimary,
  },
  body: {
    fontSize: 16,
    fontWeight: "400" as const,
    color: colors.textPrimary,
    lineHeight: 24,
  },
  bodySmall: {
    fontSize: 14,
    fontWeight: "400" as const,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  caption: {
    fontSize: 12,
    fontWeight: "400" as const,
    color: colors.textSecondary,
  },
} as const;

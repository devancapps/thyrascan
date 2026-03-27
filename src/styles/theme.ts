import { ViewStyle, TextStyle } from "react-native";

export const colors = {
  // Brand — teal (thyroid awareness, matching app icon #14b8a6)
  primary: "#14b8a6",
  primaryDark: "#0E9384",
  primaryLight: "#E6F7F5",

  // Warm coral — CTA / action (distinct from brand teal; teal+coral = strong complementary pair)
  coral: "#E07A5F",
  coralDark: "#C8623E",

  // Backgrounds — warm cream, not sterile white
  background: "#FDFBF7",
  secondaryBackground: "#F4F8F7",

  // Text — dark slate (neutral, no purple cast)
  textPrimary: "#1A2B3B",
  textSecondary: "#7A8D9C",

  // UI chrome
  border: "#D8E8E6",
  white: "#FFFFFF",
  black: "#000000",
  error: "#C4604A",
  overlay: "rgba(26, 43, 59, 0.5)",

  // Camera / scanner overlays (replaces hardcoded rgba values)
  overlayLight: "rgba(0, 0, 0, 0.4)",
  overlayMedium: "rgba(0, 0, 0, 0.55)",
  overlayDark: "rgba(0, 0, 0, 0.6)",

  // Premium gold
  gold: "#D4A043",
  goldBg: "#FEF4DC",

  // Severity mild (replaces hardcoded #6B7280 in IngredientBreakdown)
  severityMild: "#6B7280",

  // Verdict — warm, calm (never screaming)
  verdictSafe: "#52A788",
  verdictSafeBg: "#E8F5EF",
  verdictReview: "#C9864A",
  verdictReviewBg: "#FDF0E6",
  verdictAvoid: "#C4604A",
  verdictAvoidBg: "#FAEAE6",
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
  xl: 24,
  button: 16,
  pill: 100,
} as const;

// Standardized shadow presets — use these instead of inline shadow values
export const shadows = {
  sm: {
    shadowColor: colors.primaryDark,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  md: {
    shadowColor: colors.primaryDark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 3,
  },
  lg: {
    shadowColor: colors.primaryDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 14,
    elevation: 5,
  },
} as const;

// Standardized hit targets — iOS HIG minimum 44pt
export const hitTargets = {
  backButton: 44,
} as const;

export const cardStyle: ViewStyle = {
  backgroundColor: colors.white,
  borderRadius: borderRadius.lg,
  padding: spacing.md,
  ...shadows.md,
};

export const buttonStyle: ViewStyle = {
  height: 56,
  borderRadius: borderRadius.button,
  backgroundColor: colors.primary,
  alignItems: "center",
  justifyContent: "center",
  paddingHorizontal: spacing.lg,
  shadowColor: colors.primaryDark,
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.25,
  shadowRadius: 10,
  elevation: 5,
};

export const buttonTextStyle: TextStyle = {
  color: colors.white,
  fontSize: 17,
  fontWeight: "800",
  letterSpacing: 0.3,
};

export const secondaryButtonStyle: ViewStyle = {
  height: 56,
  borderRadius: borderRadius.button,
  backgroundColor: "transparent",
  borderWidth: 2,
  borderColor: colors.primary,
  alignItems: "center",
  justifyContent: "center",
  paddingHorizontal: spacing.lg,
};

export const secondaryButtonTextStyle: TextStyle = {
  color: colors.primary,
  fontSize: 17,
  fontWeight: "700",
};

export const typography = {
  h1: {
    fontSize: 28,
    fontWeight: "800" as const,
    color: colors.textPrimary,
    letterSpacing: -0.5,
  },
  h2: {
    fontSize: 22,
    fontWeight: "700" as const,
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
    lineHeight: 26,
  },
  bodySmall: {
    fontSize: 14,
    fontWeight: "400" as const,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  caption: {
    fontSize: 12,
    fontWeight: "500" as const,
    color: colors.textSecondary,
    lineHeight: 18,
  },
} as const;

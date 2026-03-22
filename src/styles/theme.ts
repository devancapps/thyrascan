import { ViewStyle, TextStyle } from "react-native";

export const colors = {
  // Brand — warm amethyst (thyroid awareness butterfly)
  primary: "#7B5EA7",
  primaryDark: "#5B3F8A",
  primaryLight: "#F0EBF8",

  // Warm coral — CTA / action (distinct from brand purple)
  coral: "#E07A5F",
  coralDark: "#C8623E",

  // Backgrounds — warm cream, not sterile white
  background: "#FDFBF7",
  secondaryBackground: "#F6F2EE",

  // Text — warm plum tones
  textPrimary: "#2D1F3D",
  textSecondary: "#8B7BA8",

  // UI chrome
  border: "#EAE4F0",
  white: "#FFFFFF",
  black: "#000000",
  error: "#C4604A",
  overlay: "rgba(45, 31, 61, 0.5)",

  // Premium gold
  gold: "#D4A043",

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

export const cardStyle: ViewStyle = {
  backgroundColor: colors.white,
  borderRadius: borderRadius.lg,
  padding: spacing.md,
  shadowColor: colors.primaryDark,
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.07,
  shadowRadius: 10,
  elevation: 3,
};

export const buttonStyle: ViewStyle = {
  height: 56,
  borderRadius: borderRadius.button,
  backgroundColor: colors.coral,
  alignItems: "center",
  justifyContent: "center",
  paddingHorizontal: spacing.lg,
  shadowColor: colors.coral,
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.3,
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

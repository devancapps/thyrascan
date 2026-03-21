import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Verdict } from "../types";
import { colors, spacing } from "../styles/theme";

interface VerdictBadgeProps {
  verdict: Verdict;
  size?: "small" | "large";
}

const verdictColors: Record<Verdict, string> = {
  [Verdict.SAFE]: colors.verdictSafe,
  [Verdict.REVIEW]: colors.verdictReview,
  [Verdict.AVOID]: colors.verdictAvoid,
};

const verdictBackgrounds: Record<Verdict, string> = {
  [Verdict.SAFE]: colors.verdictSafeBg,
  [Verdict.REVIEW]: colors.verdictReviewBg,
  [Verdict.AVOID]: colors.verdictAvoidBg,
};

const verdictIcons: Record<Verdict, keyof typeof Ionicons.glyphMap> = {
  [Verdict.SAFE]: "checkmark-circle",
  [Verdict.REVIEW]: "warning",
  [Verdict.AVOID]: "close-circle",
};

export default function VerdictBadge({
  verdict,
  size = "large",
}: VerdictBadgeProps) {
  const isLarge = size === "large";

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: verdictBackgrounds[verdict],
          borderColor: verdictColors[verdict],
          paddingVertical: isLarge ? spacing.lg : spacing.sm,
          paddingHorizontal: isLarge ? spacing.xl : spacing.md,
        },
      ]}
    >
      <Ionicons
        name={verdictIcons[verdict]}
        size={isLarge ? 56 : 24}
        color={verdictColors[verdict]}
      />
      <Text
        style={[
          styles.label,
          {
            color: verdictColors[verdict],
            fontSize: isLarge ? 32 : 14,
          },
        ]}
      >
        {verdict}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    borderWidth: 2,
    gap: 8,
  },
  label: {
    fontWeight: "800",
    letterSpacing: 2,
    textAlign: "center",
  },
});

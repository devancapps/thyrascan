import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Verdict } from "../types";
import { colors, spacing, borderRadius } from "../styles/theme";

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
  [Verdict.REVIEW]: "alert-circle",
  [Verdict.AVOID]: "close-circle",
};

const verdictSubtitles: Record<Verdict, string> = {
  [Verdict.SAFE]: "No flagged ingredients found",
  [Verdict.REVIEW]: "Worth discussing with your provider",
  [Verdict.AVOID]: "Contains thyroid-disruptive ingredients",
};

export default function VerdictBadge({ verdict, size = "large" }: VerdictBadgeProps) {
  const isLarge = size === "large";
  const color = verdictColors[verdict];
  const bg = verdictBackgrounds[verdict];

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: bg,
          borderColor: `${color}40`,
          paddingVertical: isLarge ? spacing.lg : spacing.sm,
          paddingHorizontal: isLarge ? spacing.xl : spacing.md,
          borderRadius: isLarge ? borderRadius.xl : borderRadius.md,
        },
      ]}
    >
      <Ionicons
        name={verdictIcons[verdict]}
        size={isLarge ? 52 : 22}
        color={color}
      />
      <Text
        style={[
          styles.label,
          {
            color,
            fontSize: isLarge ? 30 : 13,
            letterSpacing: isLarge ? 3 : 1,
          },
        ]}
      >
        {verdict}
      </Text>
      {isLarge && (
        <Text style={[styles.subtitle, { color }]}>
          {verdictSubtitles[verdict]}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    gap: 6,
  },
  label: {
    fontWeight: "800",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 13,
    fontWeight: "500",
    textAlign: "center",
    opacity: 0.8,
    marginTop: 2,
  },
});

import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Verdict } from "../types";
import { colors, spacing, borderRadius } from "../styles/theme";
import VerdictBadge from "./VerdictBadge";

interface ProductCardProps {
  productName: string;
  verdict: Verdict;
  timestamp?: string;
  onPress?: () => void;
}

export default function ProductCard({
  productName,
  verdict,
  timestamp,
  onPress,
}: ProductCardProps) {
  const content = (
    <View style={styles.container}>
      <View style={styles.iconWrap}>
        <Ionicons name="nutrition-outline" size={22} color={colors.primary} />
      </View>
      <View style={styles.info}>
        <Text style={styles.productName} numberOfLines={2}>
          {productName}
        </Text>
        {timestamp && (
          <Text style={styles.timestamp}>{timestamp}</Text>
        )}
      </View>
      <VerdictBadge verdict={verdict} size="small" />
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.75}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    shadowColor: colors.primaryDark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: colors.border,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.md,
    backgroundColor: colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  info: {
    flex: 1,
    gap: spacing.xs,
  },
  productName: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.textPrimary,
    lineHeight: 20,
  },
  timestamp: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: "500",
  },
});

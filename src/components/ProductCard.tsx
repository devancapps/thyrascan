import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Verdict } from "../types";
import { colors, spacing, cardStyle } from "../styles/theme";
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
    <View style={[cardStyle, styles.container]}>
      <View style={styles.info}>
        <Text style={styles.productName} numberOfLines={2}>
          {productName}
        </Text>
        {timestamp && <Text style={styles.timestamp}>{timestamp}</Text>}
      </View>
      <VerdictBadge verdict={verdict} size="small" />
    </View>
  );

  if (onPress) {
    return <TouchableOpacity onPress={onPress}>{content}</TouchableOpacity>;
  }

  return content;
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md,
  },
  info: {
    flex: 1,
    gap: spacing.xs,
  },
  productName: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  timestamp: {
    fontSize: 13,
    color: colors.textSecondary,
  },
});

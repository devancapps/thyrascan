import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors, spacing, cardStyle } from "../styles/theme";

interface TriggerListProps {
  triggers: string[];
}

export default function TriggerList({ triggers }: TriggerListProps) {
  if (triggers.length === 0) return null;

  return (
    <View style={[cardStyle, styles.container]}>
      <Text style={styles.title}>Trigger Ingredients Found</Text>
      {triggers.map((trigger, index) => (
        <View key={index} style={styles.row}>
          <View style={styles.dot} />
          <Text style={styles.triggerText}>{trigger}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingVertical: spacing.xs,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.verdictAvoid,
  },
  triggerText: {
    fontSize: 16,
    color: colors.textPrimary,
    fontWeight: "500",
  },
});

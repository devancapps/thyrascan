import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, cardStyle, buttonStyle, buttonTextStyle } from "../styles/theme";

interface ErrorCardProps {
  message: string;
  onRetry?: () => void;
  onDismiss?: () => void;
}

export default function ErrorCard({ message, onRetry, onDismiss }: ErrorCardProps) {
  return (
    <View style={[cardStyle, styles.container]}>
      <Ionicons name="alert-circle" size={48} color={colors.error} />
      <Text style={styles.message}>{message}</Text>
      {onRetry && (
        <TouchableOpacity
          style={[buttonStyle, styles.retryButton]}
          onPress={onRetry}
          activeOpacity={0.8}
        >
          <Text style={buttonTextStyle}>Try Again</Text>
        </TouchableOpacity>
      )}
      {onDismiss && (
        <TouchableOpacity
          style={styles.dismissButton}
          onPress={onDismiss}
          activeOpacity={0.7}
        >
          <Text style={styles.dismissText}>Go Back</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    gap: spacing.md,
    marginHorizontal: spacing.md,
  },
  message: {
    fontSize: 16,
    color: colors.textPrimary,
    textAlign: "center",
    lineHeight: 24,
  },
  retryButton: {
    width: "100%",
    marginTop: spacing.sm,
  },
  dismissButton: {
    paddingVertical: spacing.sm,
  },
  dismissText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: "600",
  },
});

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, borderRadius, buttonStyle, buttonTextStyle } from "../styles/theme";

interface ErrorCardProps {
  message: string;
  onRetry?: () => void;
  onDismiss?: () => void;
}

export default function ErrorCard({ message, onRetry, onDismiss }: ErrorCardProps) {
  return (
    <View style={styles.container}>
      <View style={styles.iconWrap}>
        <Ionicons name="alert-circle" size={36} color={colors.error} />
      </View>
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
    backgroundColor: colors.white,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    marginHorizontal: spacing.md,
    shadowColor: colors.primaryDark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 1,
    borderColor: colors.border,
  },
  iconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.verdictAvoidBg,
    alignItems: "center",
    justifyContent: "center",
  },
  message: {
    fontSize: 15,
    color: colors.textPrimary,
    textAlign: "center",
    lineHeight: 23,
    fontWeight: "500",
  },
  retryButton: {
    width: "100%",
    marginTop: spacing.xs,
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

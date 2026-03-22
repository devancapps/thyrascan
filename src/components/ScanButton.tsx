import React from "react";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing } from "../styles/theme";

interface ScanButtonProps {
  onPress: () => void;
  atLimit?: boolean;
}

export default function ScanButton({ onPress, atLimit }: ScanButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.button, atLimit && styles.atLimit]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.inner}>
        <Ionicons name="scan" size={26} color={colors.white} />
        <Text style={styles.text}>Scan Food</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 64,
    borderRadius: 18,
    backgroundColor: colors.coral,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.coral,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.38,
    shadowRadius: 12,
    elevation: 7,
  },
  atLimit: {
    opacity: 0.45,
  },
  inner: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  text: {
    color: colors.white,
    fontSize: 19,
    fontWeight: "800",
    letterSpacing: 0.3,
  },
});

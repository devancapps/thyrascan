import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
} from "react-native";
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
        <Ionicons name="scan" size={28} color={colors.white} />
        <Text style={styles.text}>Scan Food</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 64,
    borderRadius: 16,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  atLimit: {
    opacity: 0.5,
  },
  inner: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  text: {
    color: colors.white,
    fontSize: 20,
    fontWeight: "700",
  },
});

import React, { useEffect, useRef } from "react";
import { Animated, TouchableOpacity, Text, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, borderRadius, shadows } from "../styles/theme";

interface ScanButtonProps {
  onPress: () => void;
  atLimit?: boolean;
}

export default function ScanButton({ onPress, atLimit }: ScanButtonProps) {
  const pulseScale = useRef(new Animated.Value(1)).current;
  const pressScale = useRef(new Animated.Value(1)).current;

  // Gentle breathing pulse when not at limit
  useEffect(() => {
    if (atLimit) {
      pulseScale.setValue(1);
      return;
    }
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseScale, {
          toValue: 1.02,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseScale, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    );
    pulse.start();
    return () => pulse.stop();
  }, [atLimit]);

  function handlePressIn() {
    Animated.spring(pressScale, {
      toValue: 0.97,
      useNativeDriver: true,
      speed: 40,
      bounciness: 0,
    }).start();
  }

  function handlePressOut() {
    Animated.spring(pressScale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 30,
      bounciness: 2,
    }).start();
  }

  return (
    <Animated.View
      style={[
        atLimit && styles.atLimit,
        { transform: [{ scale: Animated.multiply(pulseScale, pressScale) }] },
      ]}
    >
      <TouchableOpacity
        style={styles.button}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
      >
        <View style={styles.inner}>
          <Ionicons name="scan" size={26} color={colors.white} />
          <Text style={styles.text}>Scan Food</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 64,
    borderRadius: borderRadius.button,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    ...shadows.lg,
    shadowColor: colors.primaryDark,
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

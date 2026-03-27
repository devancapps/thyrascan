import React, { useRef } from "react";
import { Animated, TouchableOpacity, ViewStyle, StyleProp } from "react-native";

interface AnimatedPressableProps {
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  activeOpacity?: number;
  disabled?: boolean;
  accessibilityLabel?: string;
  children: React.ReactNode;
}

/**
 * Drop-in replacement for TouchableOpacity with a subtle scale-down on press.
 * Uses useNativeDriver for smooth 60fps animation with no JS thread involvement.
 */
export default function AnimatedPressable({
  onPress,
  style,
  activeOpacity = 0.8,
  disabled = false,
  accessibilityLabel,
  children,
}: AnimatedPressableProps) {
  const scale = useRef(new Animated.Value(1)).current;

  function handlePressIn() {
    Animated.spring(scale, {
      toValue: 0.97,
      useNativeDriver: true,
      speed: 40,
      bounciness: 0,
    }).start();
  }

  function handlePressOut() {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 30,
      bounciness: 2,
    }).start();
  }

  return (
    <Animated.View style={[{ transform: [{ scale }] }, style]}>
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={activeOpacity}
        disabled={disabled}
        accessibilityLabel={accessibilityLabel}
        style={{ flex: 1 }}
      >
        {children}
      </TouchableOpacity>
    </Animated.View>
  );
}

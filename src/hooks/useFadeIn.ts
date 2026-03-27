import { useRef, useEffect } from "react";
import { Animated } from "react-native";

interface FadeInOptions {
  duration?: number;
  delay?: number;
  translateY?: number;
}

/**
 * Returns animated styles for a smooth fade-in + slide-up entrance.
 * Apply the returned style to an Animated.View wrapping your screen content.
 *
 * Usage:
 *   const fadeStyle = useFadeIn();
 *   <Animated.View style={[styles.content, fadeStyle]}>
 */
export function useFadeIn({
  duration = 350,
  delay = 0,
  translateY: translateYAmount = 12,
}: FadeInOptions = {}) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(translateYAmount)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration,
        delay,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return {
    opacity,
    transform: [{ translateY }],
  };
}

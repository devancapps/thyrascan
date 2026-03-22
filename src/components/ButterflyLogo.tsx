import React from "react";
import { View } from "react-native";
import Svg, { Path, Ellipse, Circle } from "react-native-svg";

interface ButterflyLogoProps {
  size?: number;
  color?: string;
  accentColor?: string;
  onDark?: boolean;
}

/**
 * ThyraScan butterfly logo — the thyroid gland's natural butterfly shape.
 * Warm, organic, friendly. Not clinical.
 */
export default function ButterflyLogo({
  size = 48,
  color = "#7B5EA7",
  accentColor = "#E07A5F",
  onDark = false,
}: ButterflyLogoProps) {
  const wingColor = onDark ? "rgba(255,255,255,0.95)" : color;
  const wingColorAlt = onDark ? "rgba(255,255,255,0.72)" : color;
  const bodyColor = onDark ? "rgba(255,255,255,0.55)" : "#5B3F8A";
  const dotColor = onDark ? accentColor : accentColor;

  // Scale viewBox 80x60 to requested size
  const width = size * (80 / 60);
  const height = size;

  return (
    <View style={{ width, height }}>
      <Svg width={width} height={height} viewBox="0 0 80 60">
        {/* Left upper wing */}
        <Path
          d="M38 28 C35 22 28 12 18 10 C10 8 4 14 6 20 C8 26 18 30 38 28Z"
          fill={wingColor}
          opacity={0.95}
        />
        {/* Left lower wing */}
        <Path
          d="M38 32 C30 36 18 42 12 50 C8 55 14 59 20 55 C28 50 36 40 38 32Z"
          fill={wingColorAlt}
          opacity={0.8}
        />
        {/* Right upper wing */}
        <Path
          d="M42 28 C45 22 52 12 62 10 C70 8 76 14 74 20 C72 26 62 30 42 28Z"
          fill={wingColor}
          opacity={0.95}
        />
        {/* Right lower wing */}
        <Path
          d="M42 32 C50 36 62 42 68 50 C72 55 66 59 60 55 C52 50 44 40 42 32Z"
          fill={wingColorAlt}
          opacity={0.8}
        />
        {/* Body */}
        <Ellipse cx="40" cy="30" rx="3.5" ry="11" fill={bodyColor} />
        {/* Left antenna */}
        <Path
          d="M38.5 20 C36 14 31 10 29 8"
          stroke={onDark ? "rgba(255,255,255,0.45)" : color}
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
        />
        {/* Right antenna */}
        <Path
          d="M41.5 20 C44 14 49 10 51 8"
          stroke={onDark ? "rgba(255,255,255,0.45)" : color}
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
        />
        {/* Antenna dots — coral accent */}
        <Circle cx="29" cy="8" r="2.5" fill={dotColor} />
        <Circle cx="51" cy="8" r="2.5" fill={dotColor} />
      </Svg>
    </View>
  );
}

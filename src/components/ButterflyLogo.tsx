import React from "react"; // needed for JSX transform
import { View } from "react-native";
import Svg, { Path, Ellipse, Circle, Defs, LinearGradient, Stop } from "react-native-svg";
import { colors } from "../styles/theme";

interface ButterflyLogoProps {
  size?: number;
  /** Fill color for the lobes (default: teal primary). On dark backgrounds pass onDark=true instead. */
  color?: string;
  /** Accent color for the antenna dots (default: coral). */
  accentColor?: string;
  /** When true the lobes/antennae render white, for use on teal/dark backgrounds. */
  onDark?: boolean;
  /** When true renders the full icon including the teal gradient background tile. */
  showBackground?: boolean;
}

/**
 * ThyraScan thyroid gland logo — exact bezier paths traced from the app icon
 * in brand-preview.html (viewBox 0 0 100 100).
 *
 * Anatomy:
 *  - Two curved lobes meeting at a central point (the gland body)
 *  - A narrow isthmus ellipse connecting them at the base
 *  - Two curved antennae rising from the centre toward the parathyroid dots
 *  - Coral dots at the tip of each antenna (parathyroid glands)
 */
export default function ButterflyLogo({
  size = 48,
  color = colors.primary,
  accentColor = colors.coral,
  onDark = false,
  showBackground = false,
}: ButterflyLogoProps) {
  const lobeColor   = onDark ? "rgba(255,255,255,0.95)" : color;
  const isthmusColor = onDark ? "rgba(255,255,255,0.4)"  : color;
  const antennaColor = onDark ? "rgba(255,255,255,0.65)" : color;
  const dotColor    = onDark ? "rgba(255,255,255,0.65)" : accentColor;

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size} viewBox="0 0 100 100">
        {showBackground && (
          <Defs>
            <LinearGradient id="thyraBg" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0" stopColor="#22d4be" />
              <Stop offset="1" stopColor="#0a9685" />
            </LinearGradient>
          </Defs>
        )}

        {/* Background tile — rounded square in teal gradient */}
        {showBackground && (
          <Path
            d="M18,2 L82,2 C91,2 98,9 98,18 L98,82 C98,91 91,98 82,98 L18,98 C9,98 2,91 2,82 L2,18 C2,9 9,2 18,2 Z"
            fill="url(#thyraBg)"
          />
        )}

        {/* Left lobe — exact path from brand icon */}
        <Path
          d="M50,58 C43,44 22,38 19,52 C16,66 37,73 50,64 Z"
          fill={lobeColor}
        />

        {/* Right lobe — exact path from brand icon */}
        <Path
          d="M50,58 C57,44 78,38 81,52 C84,66 63,73 50,64 Z"
          fill={lobeColor}
        />

        {/* Isthmus — narrow bridge connecting the lobes */}
        <Ellipse
          cx="50"
          cy="62"
          rx="4"
          ry="8"
          fill={isthmusColor}
          opacity={0.4}
        />

        {/* Left antenna — curved line rising from lobe toward parathyroid */}
        <Path
          d="M46,56 C42,50 37,44 33,40"
          fill="none"
          stroke={antennaColor}
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity={0.65}
        />

        {/* Right antenna */}
        <Path
          d="M54,56 C58,50 63,44 67,40"
          fill="none"
          stroke={antennaColor}
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity={0.65}
        />

        {/* Parathyroid dots — coral accent */}
        <Circle cx="33" cy="39" r="3" fill={dotColor} opacity={onDark ? 0.65 : 1} />
        <Circle cx="67" cy="39" r="3" fill={dotColor} opacity={onDark ? 0.65 : 1} />
      </Svg>
    </View>
  );
}

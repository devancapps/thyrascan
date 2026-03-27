import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Animated } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types";
import ButterflyLogo from "../components/ButterflyLogo";
import { colors, spacing, borderRadius, buttonStyle, buttonTextStyle } from "../styles/theme";
import { useFadeIn } from "../hooks/useFadeIn";
import { LinearGradient } from "expo-linear-gradient";

type Props = NativeStackScreenProps<RootStackParamList, "OnboardingWelcome">;

const FEATURES = [
  { icon: "scan-outline" as const, text: "Scan food barcodes in seconds" },
  { icon: "leaf-outline" as const, text: "Detect thyroid-related ingredients" },
  { icon: "shield-checkmark-outline" as const, text: "Get clear SAFE / REVIEW / AVOID results" },
];

export default function OnboardingWelcomeScreen({ navigation }: Props) {
  const fadeStyle = useFadeIn({ delay: 100 });

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[colors.primaryLight, colors.background]}
        style={[styles.gradientHeader, { pointerEvents: "none" }]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />
      <Animated.View style={[styles.content, fadeStyle]}>
        <View style={styles.logoWrap}>
          <ButterflyLogo size={92} showBackground onDark />
        </View>

        <Text style={styles.appName}>THYRASCAN</Text>
        <Text style={styles.headline}>
          Know what's in your food.{"\n"}Protect your thyroid.
        </Text>

        <Text style={styles.description}>
          A label scanner designed for people managing Hashimoto's
          and hypothyroid conditions.
        </Text>

        <View style={styles.features}>
          {FEATURES.map((feature, i) => (
            <View key={i} style={styles.featureRow}>
              <View style={styles.featureIconWrap}>
                <Ionicons name={feature.icon} size={18} color={colors.primary} />
              </View>
              <Text style={styles.featureText}>{feature.text}</Text>
            </View>
          ))}
        </View>
      </Animated.View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={buttonStyle}
          onPress={() => navigation.replace("Login")}
          activeOpacity={0.8}
        >
          <Text style={buttonTextStyle}>Get Started</Text>
        </TouchableOpacity>
        <Text style={styles.disclaimer}>
          Free to use · Educational purposes only
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  gradientHeader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 280,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.xl,
    gap: spacing.md,
  },
  logoWrap: {
    width: 100,
    height: 100,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.sm,
    overflow: "hidden",
  },
  appName: {
    fontSize: 12,
    fontWeight: "800",
    color: colors.primary,
    letterSpacing: 3,
    textTransform: "uppercase",
  },
  headline: {
    fontSize: 30,
    fontWeight: "800",
    color: colors.textPrimary,
    textAlign: "center",
    lineHeight: 38,
    letterSpacing: -0.5,
  },
  description: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 26,
    fontWeight: "500",
    paddingHorizontal: spacing.md,
  },
  features: {
    alignSelf: "stretch",
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    backgroundColor: colors.secondaryBackground,
    borderRadius: borderRadius.md,
    padding: spacing.md,
  },
  featureIconWrap: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  featureText: {
    fontSize: 15,
    color: colors.textPrimary,
    fontWeight: "600",
    flex: 1,
  },
  footer: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
    gap: spacing.md,
    alignItems: "center",
  },
  disclaimer: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: "500",
  },
});

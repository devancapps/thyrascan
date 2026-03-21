import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types";
import { colors, spacing, buttonStyle, buttonTextStyle } from "../styles/theme";

type Props = NativeStackScreenProps<RootStackParamList, "OnboardingWelcome">;

const FEATURES = [
  "Scan food barcodes in seconds",
  "Detect thyroid-related ingredients",
  "Get clear SAFE / REVIEW / AVOID results",
];

export default function OnboardingWelcomeScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons name="shield-checkmark" size={56} color={colors.primary} />
        </View>

        <Text style={styles.appName}>THYRASCAN</Text>
        <Text style={styles.headline}>
          Know what's in your food.{"\n"}Protect your thyroid.
        </Text>

        <Text style={styles.description}>
          A label scanner for people managing Hashimoto's
          and hypothyroid conditions.
        </Text>

        <View style={styles.features}>
          {FEATURES.map((feature, i) => (
            <View key={i} style={styles.featureRow}>
              <Ionicons name="checkmark-circle" size={22} color={colors.primary} />
              <Text style={styles.featureText}>{feature}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={buttonStyle}
          onPress={() => navigation.replace("Login")}
          activeOpacity={0.8}
        >
          <Text style={buttonTextStyle}>Get Started</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.xl,
  },
  iconContainer: {
    width: 112,
    height: 112,
    borderRadius: 28,
    backgroundColor: colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.lg,
  },
  appName: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.primary,
    letterSpacing: 2,
    textTransform: "uppercase",
    marginBottom: spacing.sm,
  },
  headline: {
    fontSize: 30,
    fontWeight: "800",
    color: colors.textPrimary,
    textAlign: "center",
    lineHeight: 38,
    marginBottom: spacing.md,
  },
  description: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.md,
  },
  features: {
    alignSelf: "stretch",
    gap: spacing.md,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  featureText: {
    fontSize: 16,
    color: colors.textPrimary,
    fontWeight: "500",
  },
  footer: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
  },
});

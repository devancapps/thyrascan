import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types";
import { useUserProfile } from "../hooks/useUserProfile";
import {
  colors,
  spacing,
  borderRadius,
  buttonStyle,
  buttonTextStyle,
  cardStyle,
} from "../styles/theme";

type Props = NativeStackScreenProps<RootStackParamList, "OnboardingHowItWorks">;

interface Step {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
}

const HOW_IT_WORKS: Step[] = [
  {
    icon: "barcode-outline",
    title: "Scan any barcode",
    description:
      "Point your camera at any food product barcode. We look up the full ingredient list instantly.",
  },
  {
    icon: "flask-outline",
    title: "We analyze the ingredients",
    description:
      "Our engine checks each ingredient against a database of thyroid-relevant compounds — goitrogens, soy, iodine, gluten, and more.",
  },
  {
    icon: "shield-checkmark-outline",
    title: "You get a clear verdict",
    description:
      "SAFE, REVIEW, or AVOID — with plain-English explanations for every flagged ingredient, personalized to your condition.",
  },
];

const VERDICTS = [
  {
    label: "SAFE",
    color: colors.verdictSafe,
    bg: colors.verdictSafeBg,
    description: "No significant thyroid triggers found",
  },
  {
    label: "REVIEW",
    color: colors.verdictReview,
    bg: colors.verdictReviewBg,
    description: "Mild or context-dependent ingredients present",
  },
  {
    label: "AVOID",
    color: colors.verdictAvoid,
    bg: colors.verdictAvoidBg,
    description: "Multiple or significant triggers detected",
  },
];

export default function OnboardingHowItWorksScreen({ navigation }: Props) {
  const { markOnboardingComplete } = useUserProfile();

  async function handleGetStarted() {
    await markOnboardingComplete();
    // AppNavigator will re-render automatically as onboardingCompleted flips to true
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.step}>Step 2 of 2</Text>
        <Text style={styles.headline}>How ThyraScan{"\n"}works</Text>

        <View style={styles.steps}>
          {HOW_IT_WORKS.map((step, i) => (
            <View key={i} style={styles.stepRow}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>{i + 1}</Text>
              </View>
              <View style={styles.stepIconWrap}>
                <Ionicons name={step.icon} size={26} color={colors.primary} />
              </View>
              <View style={styles.stepText}>
                <Text style={styles.stepTitle}>{step.title}</Text>
                <Text style={styles.stepDesc}>{step.description}</Text>
              </View>
            </View>
          ))}
        </View>

        <Text style={styles.sectionLabel}>Understanding verdicts</Text>
        <View style={styles.verdicts}>
          {VERDICTS.map((v) => (
            <View key={v.label} style={[styles.verdictRow, { backgroundColor: v.bg }]}>
              <Text style={[styles.verdictLabel, { color: v.color }]}>{v.label}</Text>
              <Text style={styles.verdictDesc}>{v.description}</Text>
            </View>
          ))}
        </View>

        <View style={[cardStyle, styles.disclaimer]}>
          <Ionicons name="information-circle-outline" size={20} color={colors.textSecondary} />
          <Text style={styles.disclaimerText}>
            ThyraScan provides informational guidance only — not medical advice. Always
            consult your healthcare provider about your diet and thyroid condition.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={buttonStyle}
          onPress={handleGetStarted}
          activeOpacity={0.8}
          accessibilityLabel="Start scanning food"
        >
          <Text style={buttonTextStyle}>Start Scanning</Text>
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
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: spacing.md,
  },
  step: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.primary,
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: spacing.sm,
  },
  headline: {
    fontSize: 28,
    fontWeight: "800",
    color: colors.textPrimary,
    lineHeight: 36,
    marginBottom: spacing.xl,
  },
  steps: {
    gap: spacing.lg,
    marginBottom: spacing.xl,
  },
  stepRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.md,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
  stepNumberText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: "700",
  },
  stepIconWrap: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.md,
    backgroundColor: colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },
  stepText: {
    flex: 1,
    paddingTop: 2,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: 4,
  },
  stepDesc: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: spacing.sm,
  },
  verdicts: {
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  verdictRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    borderRadius: borderRadius.md,
  },
  verdictLabel: {
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 1,
    width: 58,
  },
  verdictDesc: {
    flex: 1,
    fontSize: 14,
    color: colors.textPrimary,
  },
  disclaimer: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  disclaimerText: {
    flex: 1,
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 19,
  },
  footer: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
    paddingTop: spacing.sm,
  },
});

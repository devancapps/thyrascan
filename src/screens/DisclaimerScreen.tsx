import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types";
import { colors, spacing, borderRadius, buttonStyle, buttonTextStyle } from "../styles/theme";

type Props = NativeStackScreenProps<RootStackParamList, "Disclaimer">;

export default function DisclaimerScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          accessibilityLabel="Go back"
        >
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Disclaimer</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.iconRow}>
          <View style={styles.iconWrap}>
            <Ionicons name="information-circle" size={40} color={colors.primary} />
          </View>
        </View>

        <Text style={styles.title}>Important Information</Text>

        <Section title="Not Medical Advice">
          ThyraScan is an informational tool only. The verdicts, ingredient flags, and
          explanations it provides do not constitute medical advice, diagnosis, or
          treatment recommendations.
        </Section>

        <Section title="Consult Your Healthcare Provider">
          Always consult with your doctor, endocrinologist, or registered dietitian
          before making dietary changes related to your thyroid condition. Individual
          responses to foods vary significantly based on your specific diagnosis,
          medication, and health history.
        </Section>

        <Section title="Data Accuracy">
          Ingredient data is sourced from the Open Food Facts community database.
          While generally accurate, ingredient lists may be outdated, incomplete, or
          vary by region and product reformulation. Always check the physical product
          label.
        </Section>

        <Section title="Medication Interactions">
          Some ingredients flagged by ThyraScan (such as calcium, fiber, and soy)
          may affect the absorption of thyroid medication. Timing recommendations
          are general guidelines — your prescriber's instructions take priority.
        </Section>

        <Section title="Scientific Basis">
          ThyraScan's classification engine is based on peer-reviewed nutritional and
          endocrinology research. However, the science around food and thyroid health
          continues to evolve. Flags represent potential concerns, not definitive harm.
        </Section>

        <Section title="Limitations">
          ThyraScan cannot account for cooking methods, portion sizes, preparation
          techniques, or nutrient interactions that may increase or reduce the impact
          of any ingredient on thyroid function.
        </Section>

        <View style={styles.acknowledgement}>
          <Ionicons name="shield-checkmark-outline" size={20} color={colors.primary} />
          <Text style={styles.acknowledgementText}>
            By using ThyraScan you acknowledge that it is for informational purposes
            only and agree to consult a qualified healthcare professional for medical
            decisions.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={buttonStyle}
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
        >
          <Text style={buttonTextStyle}>I Understand</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

function Section({ title, children }: { title: string; children: string }) {
  return (
    <View style={sectionStyles.container}>
      <Text style={sectionStyles.title}>{title}</Text>
      <Text style={sectionStyles.body}>{children}</Text>
    </View>
  );
}

const sectionStyles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  body: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 21,
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: spacing.md,
  },
  iconRow: {
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  iconWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: colors.textPrimary,
    marginBottom: spacing.xl,
    textAlign: "center",
  },
  acknowledgement: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.sm,
    backgroundColor: colors.primaryLight,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  acknowledgementText: {
    flex: 1,
    fontSize: 13,
    color: colors.primaryDark,
    lineHeight: 19,
    fontWeight: "500",
  },
  footer: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
    paddingTop: spacing.sm,
  },
});

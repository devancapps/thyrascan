import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList, Verdict } from "../types";
import { getVerdictMessage } from "../logic/verdictGenerator";
import { useFadeIn } from "../hooks/useFadeIn";
import VerdictBadge from "../components/VerdictBadge";
import IngredientBreakdown from "../components/IngredientBreakdown";
import {
  colors,
  spacing,
  buttonStyle,
  buttonTextStyle,
  cardStyle,
  typography,
  hitTargets,
} from "../styles/theme";

type Props = NativeStackScreenProps<RootStackParamList, "Result">;

export default function ResultScreen({ navigation, route }: Props) {
  const {
    productName,
    verdict,
    matchedIngredients,
    scoringResult,
    fromHistory,
    scannedAtLabel,
  } = route.params;
  const verdictEnum = verdict as Verdict;
  const isHistory = fromHistory === true;
  const fadeStyle = useFadeIn({ delay: 50 });

  return (
    <SafeAreaView style={styles.container}>
      {isHistory && (
        <View style={styles.historyHeader}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
            accessibilityLabel="Go back to history"
          >
            <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.historyTitle}>History</Text>
          <View style={styles.headerSpacer} />
        </View>
      )}

      <Animated.ScrollView
        style={[styles.scroll, fadeStyle]}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={[cardStyle, styles.productCard]}>
          <Text style={styles.productLabel}>Product</Text>
          <Text style={styles.productName}>{productName}</Text>
          {isHistory && (
            <View style={styles.pastScanMeta}>
              <Text style={styles.pastScanLabel}>Past scan</Text>
              {scannedAtLabel && (
                <Text style={styles.pastScanTimestamp}>{scannedAtLabel}</Text>
              )}
            </View>
          )}
        </View>

        <View style={styles.verdictSection}>
          <VerdictBadge verdict={verdictEnum} size="large" />
        </View>

        <Text style={styles.message}>
          {getVerdictMessage(scoringResult)}
        </Text>

        <IngredientBreakdown
          matchedIngredients={matchedIngredients}
          scoringResult={scoringResult}
        />

        <View style={styles.disclaimer}>
          <Ionicons
            name="information-circle-outline"
            size={16}
            color={colors.textSecondary}
          />
          <Text style={styles.disclaimerText}>
            For informational purposes only. Not medical advice.{" "}
            <Text
              style={styles.disclaimerLink}
              onPress={() => navigation.navigate("Disclaimer")}
            >
              Learn more
            </Text>
          </Text>
        </View>
      </Animated.ScrollView>

      {!isHistory && (
        <View style={styles.footer}>
          <TouchableOpacity
            style={buttonStyle}
            onPress={() => navigation.navigate("MainTabs")}
            activeOpacity={0.8}
          >
            <Text style={buttonTextStyle}>Scan Another</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.secondaryBackground,
  },
  historyHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor: colors.secondaryBackground,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    width: hitTargets.backButton,
    height: hitTargets.backButton,
    alignItems: "center",
    justifyContent: "center",
  },
  historyTitle: {
    ...typography.h2,
    textAlign: "center",
  },
  headerSpacer: {
    width: hitTargets.backButton,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
    gap: spacing.lg,
    paddingBottom: spacing.md,
  },
  footer: {
    padding: spacing.lg,
    paddingBottom: spacing.md,
    backgroundColor: colors.secondaryBackground,
  },
  productCard: {
    gap: spacing.xs,
  },
  productLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  productName: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  pastScanMeta: {
    marginTop: spacing.sm,
    gap: 2,
  },
  pastScanLabel: {
    ...typography.caption,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  pastScanTimestamp: {
    ...typography.bodySmall,
  },
  verdictSection: {
    alignItems: "center",
  },
  message: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 24,
    paddingHorizontal: spacing.md,
  },
  disclaimer: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.xs,
    backgroundColor: colors.secondaryBackground,
    borderRadius: 12,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  disclaimerText: {
    flex: 1,
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  disclaimerLink: {
    color: colors.primary,
    fontWeight: "600",
  },
});

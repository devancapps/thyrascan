import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { MatchedIngredient, ScoringResult, TriggerCategory } from "../types";
import { colors, spacing, borderRadius, cardStyle } from "../styles/theme";

interface Props {
  matchedIngredients: MatchedIngredient[];
  scoringResult: ScoringResult;
}

const SEVERITY_COLORS: Record<string, string> = {
  significant: colors.verdictAvoid,
  moderate: colors.verdictReview,
  mild: colors.severityMild,
};

const CATEGORY_LABELS: Record<TriggerCategory, string> = {
  goitrogen: "Goitrogen",
  soy: "Soy",
  gluten: "Gluten",
  iodine_excess: "Iodine Excess",
  endocrine_disruptor: "Endocrine Disruptor",
  absorption_blocker: "Absorption Blocker",
  inflammatory_additive: "Inflammatory Additive",
};

function SeverityDot({ severity }: { severity: string }) {
  return (
    <View
      style={[
        severityStyles.dot,
        { backgroundColor: SEVERITY_COLORS[severity] ?? colors.textSecondary },
      ]}
    />
  );
}

const severityStyles = StyleSheet.create({
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 6,
  },
});

function IngredientRow({ item }: { item: MatchedIngredient }) {
  const [expanded, setExpanded] = useState(false);
  const hasDetail = !!(item.explanation || item.caveat || item.medicationInteraction);

  return (
    <TouchableOpacity
      onPress={() => hasDetail && setExpanded((v) => !v)}
      activeOpacity={hasDetail ? 0.7 : 1}
      style={styles.ingredientRow}
      accessibilityRole={hasDetail ? "button" : "text"}
      accessibilityLabel={`${item.displayName}, ${item.severity} severity`}
      accessibilityHint={hasDetail ? "Tap to see details" : undefined}
    >
      <SeverityDot severity={item.severity} />
      <View style={styles.ingredientBody}>
        <View style={styles.ingredientHeader}>
          <Text style={styles.ingredientName}>{item.displayName}</Text>
          <View style={styles.tags}>
            <View style={styles.categoryTag}>
              <Text style={styles.categoryTagText}>
                {CATEGORY_LABELS[item.category] ?? item.category}
              </Text>
            </View>
            {hasDetail && (
              <Ionicons
                name={expanded ? "chevron-up" : "chevron-down"}
                size={14}
                color={colors.textSecondary}
              />
            )}
          </View>
        </View>

        {expanded && (
          <View style={styles.ingredientDetail}>
            {item.explanation ? (
              <Text style={styles.detailText}>{item.explanation}</Text>
            ) : null}
            {item.caveat ? (
              <Text style={styles.caveatText}>
                <Text style={styles.caveatLabel}>Note: </Text>
                {item.caveat}
              </Text>
            ) : null}
            {item.medicationInteraction ? (
              <View style={styles.medWarning}>
                <Ionicons
                  name="medical-outline"
                  size={14}
                  color={colors.verdictReview}
                />
                <Text style={styles.medWarningText}>
                  May affect medication absorption timing.
                </Text>
              </View>
            ) : null}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

export default function IngredientBreakdown({
  matchedIngredients,
  scoringResult,
}: Props) {
  if (matchedIngredients.length === 0) return null;

  return (
    <View style={[cardStyle, styles.container]}>
      <View style={styles.titleRow}>
        <Text style={styles.title}>Flagged Ingredients</Text>
        <Text style={styles.count}>
          {matchedIngredients.length} found
        </Text>
      </View>

      {scoringResult.medicationWarning && (
        <View style={styles.medicationBanner}>
          <Ionicons name="medical" size={16} color={colors.verdictReview} />
          <Text style={styles.medicationBannerText}>
            One or more ingredients may affect thyroid medication absorption. Take
            medications 1–2 hours before or 4 hours after eating these foods.
          </Text>
        </View>
      )}

      {scoringResult.conditionSpecificWarning && (
        <View style={styles.conditionBanner}>
          <Ionicons name="alert-circle-outline" size={16} color={colors.primary} />
          <Text style={styles.conditionBannerText}>
            {scoringResult.conditionSpecificWarning}
          </Text>
        </View>
      )}

      <View style={styles.legend}>
        {["significant", "moderate", "mild"].map((s) => (
          <View key={s} style={styles.legendItem}>
            <SeverityDot severity={s} />
            <Text style={styles.legendText}>{s.charAt(0).toUpperCase() + s.slice(1)}</Text>
          </View>
        ))}
        <Text style={styles.legendHint}>Tap for details</Text>
      </View>

      <View style={styles.list}>
        {matchedIngredients.map((item) => (
          <IngredientRow key={item.entryId} item={item} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.xs,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  count: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: "500",
  },
  medicationBanner: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.xs,
    backgroundColor: colors.verdictReviewBg,
    borderRadius: borderRadius.sm,
    padding: spacing.sm,
  },
  medicationBannerText: {
    flex: 1,
    fontSize: 13,
    color: colors.verdictReview,
    lineHeight: 18,
    fontWeight: "500",
  },
  conditionBanner: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.xs,
    backgroundColor: colors.primaryLight,
    borderRadius: borderRadius.sm,
    padding: spacing.sm,
  },
  conditionBannerText: {
    flex: 1,
    fontSize: 13,
    color: colors.primaryDark,
    lineHeight: 18,
    fontWeight: "500",
  },
  legend: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    paddingVertical: spacing.xs,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  legendText: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  legendHint: {
    marginLeft: "auto" as never,
    fontSize: 11,
    color: colors.textSecondary,
    fontStyle: "italic",
  },
  list: {
    gap: spacing.sm,
  },
  ingredientRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.sm,
    paddingVertical: spacing.xs,
  },
  ingredientBody: {
    flex: 1,
  },
  ingredientHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    flexWrap: "wrap",
  },
  ingredientName: {
    fontSize: 15,
    color: colors.textPrimary,
    fontWeight: "600",
    flex: 1,
  },
  tags: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  categoryTag: {
    backgroundColor: colors.secondaryBackground,
    borderRadius: borderRadius.sm,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: colors.border,
  },
  categoryTagText: {
    fontSize: 10,
    color: colors.textSecondary,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },
  ingredientDetail: {
    marginTop: spacing.xs,
    gap: 4,
  },
  detailText: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  caveatText: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
    fontStyle: "italic",
  },
  caveatLabel: {
    fontWeight: "600",
    fontStyle: "normal",
  },
  medWarning: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 4,
    marginTop: 2,
  },
  medWarningText: {
    flex: 1,
    fontSize: 12,
    color: colors.verdictReview,
    lineHeight: 17,
    fontWeight: "500",
  },
});

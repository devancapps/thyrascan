import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { RootStackParamList, Verdict, MatchedIngredient, ScoringResult } from "../types";
import { useAuth } from "../hooks/useAuth";
import { useSubscription } from "../hooks/useSubscription";
import { getScanHistory } from "../firebase/firestore";
import { INGREDIENT_DATABASE } from "../logic/ingredientDatabase";
import ProductCard from "../components/ProductCard";
import LoadingSpinner from "../components/LoadingSpinner";
import { colors, spacing, buttonStyle, buttonTextStyle } from "../styles/theme";

interface StoredIngredient {
  id: string;
  displayName: string;
  category: string;
  severity: string;
}

interface HistoryItem {
  id: string;
  product_name: string;
  verdict: Verdict;
  scanned_at: { seconds: number };
  matched_ingredients: StoredIngredient[];
  medication_warning?: boolean | null;
  barcode: string;
}

function buildMatchedIngredientsFromHistory(
  stored: StoredIngredient[],
): MatchedIngredient[] {
  return (stored ?? []).map((s) => {
    const entry = INGREDIENT_DATABASE.find((e) => e.id === s.id);
    if (entry) {
      return {
        entryId: entry.id,
        displayName: entry.displayName,
        category: entry.category,
        severity: entry.severity,
        confidence: entry.confidence,
        explanation: entry.explanation,
        caveat: entry.caveat,
        medicationInteraction: !!entry.medicationInteraction,
        matchedPattern: entry.displayName.toLowerCase(),
      };
    }
    // Fallback for entries removed from database
    return {
      entryId: s.id,
      displayName: s.displayName,
      category: s.category as MatchedIngredient["category"],
      severity: s.severity as MatchedIngredient["severity"],
      confidence: "low" as const,
      explanation: "",
      matchedPattern: s.displayName.toLowerCase(),
      medicationInteraction: false,
    };
  });
}

function buildScoringResultFromHistory(
  verdict: Verdict,
  matched: MatchedIngredient[],
  hasMedicationWarning?: boolean | null,
): ScoringResult {
  return {
    overallVerdict: verdict,
    verdictReason: "Restored from scan history",
    categoryBreakdown: [],
    totalFlagCount: matched.length,
    significantCount: matched.filter((m) => m.severity === "significant").length,
    medicationWarning: !!hasMedicationWarning,
  };
}

export default function HistoryScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { user } = useAuth();
  const { isPremium, refresh: refreshSubscription } = useSubscription();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadHistory = useCallback(async () => {
    if (!user?.uid) {
      setLoading(false);
      return;
    }
    if (!isPremium) {
      setLoading(false);
      return;
    }
    try {
      const data = await getScanHistory(user.uid);
      setHistory(data as unknown as HistoryItem[]);
    } catch {
      // Scan history fetch failed — show empty list rather than crashing
    } finally {
      setLoading(false);
    }
  }, [user?.uid, isPremium]);

  useFocusEffect(
    useCallback(() => {
      refreshSubscription();
      loadHistory();
    }, [refreshSubscription, loadHistory]),
  );

  async function handleRefresh() {
    setRefreshing(true);
    await loadHistory();
    setRefreshing(false);
  }

  function formatDate(timestamp: { seconds: number }): string {
    const date = new Date(timestamp.seconds * 1000);
    return date.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  }

  if (!isPremium) {
    return (
      <SafeAreaView style={styles.emptyContainer}>
        <Ionicons
          name="lock-closed-outline"
          size={64}
          color={colors.textSecondary}
        />
        <Text style={styles.emptyTitle}>Premium Feature</Text>
        <Text style={styles.emptyText}>
          Upgrade to Premium to view your scan history and track the products
          you've checked.
        </Text>
        <TouchableOpacity
          style={buttonStyle}
          onPress={() => navigation.navigate("Paywall")}
          activeOpacity={0.8}
        >
          <Text style={buttonTextStyle}>Upgrade to Premium</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  if (loading) {
    return <LoadingSpinner fullScreen message="Loading history..." />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Scan History</Text>
      <FlatList
        data={history}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.primary}
          />
        }
        renderItem={({ item }) => (
          <ProductCard
            productName={item.product_name}
            verdict={item.verdict}
            timestamp={formatDate(item.scanned_at)}
            onPress={() => {
              const matched = buildMatchedIngredientsFromHistory(
                item.matched_ingredients,
              );
              const scoringResult = buildScoringResultFromHistory(
                item.verdict,
                matched,
                item.medication_warning,
              );
              navigation.navigate("Result", {
                productName: item.product_name,
                barcode: item.barcode,
                verdict: item.verdict,
                matchedIngredients: matched,
                scoringResult,
                fromHistory: true,
                scannedAtLabel: `Scanned on ${formatDate(item.scanned_at)}`,
              });
            }}
          />
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={
          <View style={styles.emptyList}>
            <Ionicons
              name="scan-outline"
              size={48}
              color={colors.textSecondary}
            />
            <Text style={styles.emptyListText}>
              No scans yet. Start scanning foods to build your history.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.secondaryBackground,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.textPrimary,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  list: {
    padding: spacing.md,
    paddingBottom: spacing.xxl,
  },
  separator: {
    height: spacing.sm,
  },
  emptyContainer: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.xl,
    gap: spacing.md,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: spacing.md,
    paddingHorizontal: spacing.md,
  },
  emptyList: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.xxl,
    gap: spacing.md,
  },
  emptyListText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 24,
    paddingHorizontal: spacing.lg,
  },
});

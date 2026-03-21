import React, { useCallback, useRef } from "react";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { RootStackParamList } from "../types";
import { useAuth } from "../hooks/useAuth";
import { useSubscription } from "../hooks/useSubscription";
import { useUserProfile } from "../hooks/useUserProfile";
import { useScanLimit } from "../hooks/useScanLimit";
import ScanButton from "../components/ScanButton";
import LoadingSpinner from "../components/LoadingSpinner";
import { colors, spacing } from "../styles/theme";
import { FREE_SCAN_LIMIT } from "../logic/scanLimiter";

export default function HomeScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { user } = useAuth();
  const { condition } = useUserProfile();
  const { isPremium, loading: subscriptionLoading, refresh: refreshSubscription } =
    useSubscription();
  const { canScan, remainingScans, loading: scanLimitLoading, refresh } = useScanLimit(
    user?.uid,
    isPremium,
  );
  const isInitialFocus = useRef(true);

  // Skip refresh on first focus: subscription was just loaded by the gate.
  // Refreshing here would set loading=true and re-close the gate (flash to loader).
  useFocusEffect(
    useCallback(() => {
      if (isInitialFocus.current) {
        isInitialFocus.current = false;
        return;
      }
      refreshSubscription();
    }, [refreshSubscription]),
  );

  function handleScan() {
    if (!canScan) {
      navigation.navigate("Paywall");
      return;
    }
    navigation.navigate("Scanner");
  }

  if (subscriptionLoading) {
    return <LoadingSpinner fullScreen message="Loading..." />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Ionicons name="shield-checkmark" size={40} color={colors.primary} />
          </View>
          <Text style={styles.title}>ThyraScan</Text>
          <Text style={styles.subtitle}>
            Scan a barcode to check for{"\n"}thyroid-related ingredients
          </Text>
          {condition && (
            <View style={styles.conditionBadge}>
              <Ionicons name="person-circle-outline" size={14} color={colors.primary} />
              <Text style={styles.conditionText}>
                {condition === "hashimotos"
                  ? "Hashimoto's"
                  : condition === "hypothyroidism"
                  ? "Hypothyroidism"
                  : "Exploring"}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.scanSection}>
          <ScanButton onPress={handleScan} atLimit={!scanLimitLoading && !canScan} />

          {!isPremium && (
            <View style={styles.limitInfo}>
              <Ionicons
                name="information-circle-outline"
                size={18}
                color={colors.textSecondary}
              />
              <Text style={styles.limitText}>
                {remainingScans} of {FREE_SCAN_LIMIT} free scans remaining today
              </Text>
            </View>
          )}

          {isPremium && (
            <View style={styles.premiumBadge}>
              <Ionicons name="star" size={16} color="#F59E0B" />
              <Text style={styles.premiumText}>Premium • Unlimited Scans</Text>
            </View>
          )}
        </View>
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
    justifyContent: "center",
    paddingHorizontal: spacing.xl,
    gap: spacing.xxl,
  },
  header: {
    alignItems: "center",
    gap: spacing.sm,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.sm,
  },
  conditionBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: colors.primaryLight,
    borderRadius: 20,
    marginTop: spacing.xs,
  },
  conditionText: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: "600",
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 24,
  },
  scanSection: {
    gap: spacing.md,
  },
  limitInfo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
  },
  limitText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  premiumBadge: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
  },
  premiumText: {
    fontSize: 14,
    color: "#F59E0B",
    fontWeight: "600",
  },
});

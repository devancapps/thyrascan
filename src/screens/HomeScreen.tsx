import React, { useCallback, useRef } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
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
import ButterflyLogo from "../components/ButterflyLogo";
import LoadingSpinner from "../components/LoadingSpinner";
import { colors, spacing, borderRadius } from "../styles/theme";
import { FREE_SCAN_LIMIT } from "../logic/scanLimiter";
import { useFadeIn } from "../hooks/useFadeIn";

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
  const fadeStyle = useFadeIn();

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

  function conditionLabel() {
    if (condition === "hashimotos") return "Hashimoto's";
    if (condition === "hypothyroidism") return "Hypothyroidism";
    if (condition === "exploring") return "Just Exploring";
    return null;
  }

  if (subscriptionLoading) {
    return <LoadingSpinner fullScreen message="Loading..." />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={[styles.content, fadeStyle]}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoWrap}>
            <ButterflyLogo size={44} />
          </View>
          <Text style={styles.title}>ThyraScan</Text>
          <Text style={styles.subtitle}>
            Scan a barcode to check for{"\n"}thyroid-related ingredients
          </Text>
          {condition && (
            <View style={styles.conditionBadge}>
              <Ionicons name="leaf-outline" size={13} color={colors.primary} />
              <Text style={styles.conditionText}>{conditionLabel()}</Text>
            </View>
          )}
        </View>

        {/* Scan section */}
        <View style={styles.scanSection}>
          <ScanButton onPress={handleScan} atLimit={!scanLimitLoading && !canScan} />

          {!isPremium && (
            <View style={styles.limitInfo}>
              <Ionicons
                name="time-outline"
                size={16}
                color={colors.textSecondary}
              />
              <Text style={styles.limitText}>
                {remainingScans} of {FREE_SCAN_LIMIT} free scans remaining today
              </Text>
            </View>
          )}

          {isPremium && (
            <View style={styles.premiumBadge}>
              <Ionicons name="star" size={15} color={colors.gold} />
              <Text style={styles.premiumText}>Premium · Unlimited Scans</Text>
            </View>
          )}
        </View>
      </Animated.View>
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
  logoWrap: {
    width: 84,
    height: 84,
    borderRadius: 26,
    backgroundColor: colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.xs,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: colors.textPrimary,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 24,
    fontWeight: "500",
  },
  conditionBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 5,
    backgroundColor: colors.primaryLight,
    borderRadius: borderRadius.pill,
    marginTop: spacing.xs,
  },
  conditionText: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: "700",
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
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: "500",
  },
  premiumBadge: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
  },
  premiumText: {
    fontSize: 13,
    color: colors.gold,
    fontWeight: "700",
  },
});

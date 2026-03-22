import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Linking,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { PURCHASES_ERROR_CODE } from "react-native-purchases";
import { RootStackParamList } from "../types";
import { useSubscription } from "../hooks/useSubscription";
import LoadingSpinner from "../components/LoadingSpinner";
import { colors, spacing, buttonStyle, buttonTextStyle } from "../styles/theme";

type Props = NativeStackScreenProps<RootStackParamList, "Paywall">;

const FEATURES = [
  {
    icon: "scan" as const,
    title: "Unlimited Scans",
    description: "Scan as many products as you need, every day",
  },
  {
    icon: "time" as const,
    title: "Scan History",
    description: "Review all your past scans anytime",
  },
  {
    icon: "heart" as const,
    title: "Support Development",
    description: "Help us keep improving the app",
  },
];

export default function PaywallScreen({ navigation }: Props) {
  const { purchase, restore } = useSubscription();
  const [loading, setLoading] = useState(false);

  async function handlePurchase() {
    setLoading(true);
    try {
      const success = await purchase();
      if (success) {
        Alert.alert("Welcome to Premium!", "You now have unlimited scans.", [
          { text: "OK", onPress: () => navigation.goBack() },
        ]);
      } else {
        Alert.alert(
          "Purchase Failed",
          "The purchase did not complete. Please try again.",
        );
      }
    } catch (err: unknown) {
      const rc = err as { code?: string; message?: string };
      if (rc.code === String(PURCHASES_ERROR_CODE.PURCHASE_CANCELLED_ERROR)) {
        return;
      }
      const msg = err instanceof Error ? err.message : String(err);
      Alert.alert("Purchase Error", msg);
    } finally {
      setLoading(false);
    }
  }

  async function handleRestore() {
    setLoading(true);
    try {
      const success = await restore();
      if (success) {
        Alert.alert(
          "Restored!",
          "Your premium subscription has been restored.",
          [{ text: "OK", onPress: () => navigation.goBack() }],
        );
      } else {
        Alert.alert(
          "No Purchases Found",
          "No previous subscription found to restore.",
        );
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      Alert.alert("Restore Error", msg);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <LoadingSpinner fullScreen message="Processing..." />;
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Top bar: close button with equal spacing from top and right */}
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="close" size={26} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* Scrollable content — only this region scrolls */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <View style={styles.starContainer}>
            <Ionicons name="star" size={40} color={colors.gold} />
          </View>
          <Text style={styles.title}>Go Premium</Text>
          <Text style={styles.subtitle}>
            Unlock the full power of ThyraScan
          </Text>
        </View>

        <View style={styles.features}>
          {FEATURES.map((feature, index) => (
            <View key={index} style={styles.featureRow}>
              <View style={styles.featureIcon}>
                <Ionicons
                  name={feature.icon}
                  size={24}
                  color={colors.primary}
                />
              </View>
              <View style={styles.featureText}>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDescription}>
                  {feature.description}
                </Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.pricing}>
          <Text style={styles.price}>$4.99</Text>
          <Text style={styles.period}>/month</Text>
        </View>
      </ScrollView>

      {/* Fixed footer — always visible, never hidden behind scroll */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={buttonStyle}
          onPress={handlePurchase}
          activeOpacity={0.8}
        >
          <Text style={buttonTextStyle}>Subscribe Now — $4.99/mo</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.restoreButton} onPress={handleRestore}>
          <Text style={styles.restoreText}>Restore Purchase</Text>
        </TouchableOpacity>

        <Text style={styles.legalText}>
          Subscription automatically renews for $4.99/month unless cancelled at
          least 24 hours before the end of the current period. Manage or cancel
          anytime in your App Store settings.
        </Text>

        <View style={styles.legalLinks}>
          <TouchableOpacity
            onPress={() =>
              Linking.openURL("https://thyrascan.app/privacy")
            }
          >
            <Text style={styles.legalLink}>Privacy Policy</Text>
          </TouchableOpacity>
          <Text style={styles.legalSeparator}>·</Text>
          <TouchableOpacity
            onPress={() =>
              Linking.openURL(
                "https://www.apple.com/legal/internet-services/itunes/dev/stdeula/",
              )
            }
          >
            <Text style={styles.legalLink}>Terms of Use</Text>
          </TouchableOpacity>
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
  topBar: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.secondaryBackground,
    alignItems: "center",
    justifyContent: "center",
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.lg,
    gap: spacing.xl,
  },
  footer: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
    gap: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.background,
  },
  header: {
    alignItems: "center",
    gap: spacing.sm,
  },
  starContainer: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: "#FEF4DC",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.sm,
  },
  title: {
    fontSize: 30,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: "center",
  },
  features: {
    gap: spacing.md,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },
  featureText: {
    flex: 1,
    gap: 2,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  featureDescription: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  pricing: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "center",
    gap: 4,
  },
  price: {
    fontSize: 40,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  period: {
    fontSize: 18,
    color: colors.textSecondary,
    fontWeight: "500",
  },
  restoreButton: {
    alignItems: "center",
    paddingVertical: spacing.sm,
  },
  restoreText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: "600",
  },
  legalText: {
    fontSize: 11,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 16,
    paddingHorizontal: spacing.sm,
  },
  legalLinks: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: spacing.xs,
  },
  legalLink: {
    fontSize: 11,
    color: colors.primary,
    fontWeight: "500",
  },
  legalSeparator: {
    fontSize: 11,
    color: colors.textSecondary,
  },
});

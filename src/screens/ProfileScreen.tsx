import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { RootStackParamList } from "../types";
import { useAuth } from "../hooks/useAuth";
import { useSubscription } from "../hooks/useSubscription";
import { useUserProfile } from "../hooks/useUserProfile";
import { UserCondition } from "../types";
import LoadingSpinner from "../components/LoadingSpinner";
import { colors, spacing, borderRadius, buttonStyle, buttonTextStyle, cardStyle } from "../styles/theme";

const BENEFITS = [
  { icon: "scan" as const, text: "Unlimited daily scans" },
  { icon: "time" as const, text: "Full scan history" },
  { icon: "heart" as const, text: "Support development" },
];

export default function ProfileScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { user, signOut, deleteAccount } = useAuth();
  const { isPremium, refresh } = useSubscription();
  const { condition, setCondition } = useUserProfile();
  const [loading, setLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh]),
  );

  function getInitial(): string {
    return (user?.email ?? "U").charAt(0).toUpperCase();
  }

  function conditionLabel(c: UserCondition | null): string {
    if (c === "hashimotos") return "Hashimoto's Thyroiditis";
    if (c === "hypothyroidism") return "Hypothyroidism";
    if (c === "exploring") return "Just Exploring";
    return "Not set";
  }

  function handleChangeCondition() {
    Alert.alert(
      "Change Condition",
      "Select your thyroid condition",
      [
        { text: "Hashimoto's Thyroiditis", onPress: () => setCondition("hashimotos") },
        { text: "Hypothyroidism", onPress: () => setCondition("hypothyroidism") },
        { text: "Just Exploring", onPress: () => setCondition("exploring") },
        { text: "Cancel", style: "cancel" },
      ],
    );
  }

  async function handleSignOut() {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: async () => {
          setLoading(true);
          try {
            await signOut();
          } finally {
            setLoading(false);
          }
        },
      },
    ]);
  }

  async function handleDeleteAccount() {
    Alert.alert(
      "Delete Account",
      "This will permanently delete your account and all data. This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            setLoading(true);
            try {
              await deleteAccount();
            } catch (err: unknown) {
              setLoading(false);
              const code = (err as { code?: string })?.code;
              if (code === "auth/requires-recent-login") {
                Alert.alert(
                  "Sign In Required",
                  "For security, please sign out and sign back in before deleting your account.",
                );
              } else {
                Alert.alert("Error", "Could not delete account. Please try again.");
              }
            }
          },
        },
      ],
    );
  }

  if (loading) {
    return <LoadingSpinner fullScreen message="Please wait..." />;
  }

  if (isPremium) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.screenTitle}>Account</Text>

          {/* Avatar + email */}
          <View style={styles.avatarSection}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{getInitial()}</Text>
            </View>
            <Text style={styles.email}>{user?.email}</Text>
          </View>

          {/* Subscription status */}
          <View style={[cardStyle, styles.subscriptionCard]}>
            <View style={styles.subscriptionBadge}>
              <Ionicons name="star" size={18} color={colors.gold} />
              <Text style={styles.subscriptionBadgeText}>Premium Active</Text>
            </View>
            <Text style={styles.subscriptionDetail}>
              Unlimited scans • Full history access
            </Text>
          </View>

          {/* Condition card */}
          <TouchableOpacity
            style={[cardStyle, styles.conditionCard]}
            onPress={handleChangeCondition}
            activeOpacity={0.7}
          >
            <View style={styles.conditionIconWrap}>
              <Ionicons name="pulse-outline" size={20} color={colors.primary} />
            </View>
            <View style={styles.conditionInfo}>
              <Text style={styles.conditionCardLabel}>Thyroid Condition</Text>
              <Text style={styles.conditionCardValue}>{conditionLabel(condition)}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
          </TouchableOpacity>

          {/* Account actions */}
          <View style={[cardStyle, styles.actionsCard]}>
            <TouchableOpacity
              style={styles.actionRow}
              onPress={handleSignOut}
              activeOpacity={0.7}
            >
              <View style={styles.actionIcon}>
                <Ionicons name="log-out-outline" size={22} color={colors.textPrimary} />
              </View>
              <Text style={styles.actionText}>Sign Out</Text>
              <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity
              style={styles.actionRow}
              onPress={handleDeleteAccount}
              activeOpacity={0.7}
            >
              <View style={[styles.actionIcon, styles.actionIconDanger]}>
                <Ionicons name="trash-outline" size={22} color={colors.error} />
              </View>
              <Text style={[styles.actionText, styles.actionTextDanger]}>
                Delete Account
              </Text>
              <Ionicons name="chevron-forward" size={18} color={colors.error} />
            </TouchableOpacity>
          </View>

          <Text style={styles.deleteNote}>
            Deleting your account permanently removes all your data.
          </Text>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Free user — upgrade pitch
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.screenTitle}>Account</Text>

        {/* Avatar + email */}
        <View style={styles.avatarSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{getInitial()}</Text>
          </View>
          <Text style={styles.email}>{user?.email}</Text>
          <View style={styles.freeBadge}>
            <Text style={styles.freeBadgeText}>Free Plan</Text>
          </View>
        </View>

        {/* Upgrade card */}
        <View style={styles.upgradeCard}>
          <View style={styles.starContainer}>
            <Ionicons name="star" size={36} color={colors.gold} />
          </View>
          <Text style={styles.upgradeTitle}>Upgrade to Premium</Text>
          <Text style={styles.upgradeSubtitle}>
            Get unlimited access to all features
          </Text>

          <View style={styles.benefits}>
            {BENEFITS.map((b, i) => (
              <View key={i} style={styles.benefitRow}>
                <Ionicons name={b.icon} size={20} color={colors.primary} />
                <Text style={styles.benefitText}>{b.text}</Text>
              </View>
            ))}
          </View>

          <View style={styles.priceRow}>
            <Text style={styles.price}>$4.99</Text>
            <Text style={styles.period}>/month</Text>
          </View>

          <TouchableOpacity
            style={buttonStyle}
            onPress={() => navigation.navigate("Paywall")}
            activeOpacity={0.8}
          >
            <Text style={buttonTextStyle}>View Subscription Options</Text>
          </TouchableOpacity>
        </View>

        {/* Condition card */}
        <TouchableOpacity
          style={[cardStyle, styles.conditionCard]}
          onPress={handleChangeCondition}
          activeOpacity={0.7}
        >
          <View style={styles.conditionIconWrap}>
            <Ionicons name="pulse-outline" size={20} color={colors.primary} />
          </View>
          <View style={styles.conditionInfo}>
            <Text style={styles.conditionCardLabel}>Thyroid Condition</Text>
            <Text style={styles.conditionCardValue}>{conditionLabel(condition)}</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
        </TouchableOpacity>

        {/* Account actions for free users */}
        <View style={[cardStyle, styles.actionsCard]}>
          <TouchableOpacity
            style={styles.actionRow}
            onPress={handleSignOut}
            activeOpacity={0.7}
          >
            <View style={styles.actionIcon}>
              <Ionicons name="log-out-outline" size={22} color={colors.textPrimary} />
            </View>
            <Text style={styles.actionText}>Sign Out</Text>
            <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.actionRow}
            onPress={handleDeleteAccount}
            activeOpacity={0.7}
          >
            <View style={[styles.actionIcon, styles.actionIconDanger]}>
              <Ionicons name="trash-outline" size={22} color={colors.error} />
            </View>
            <Text style={[styles.actionText, styles.actionTextDanger]}>
              Delete Account
            </Text>
            <Ionicons name="chevron-forward" size={18} color={colors.error} />
          </TouchableOpacity>
        </View>

        <Text style={styles.deleteNote}>
          Deleting your account permanently removes all your data.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.secondaryBackground,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
    gap: spacing.lg,
  },
  screenTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: colors.textPrimary,
    paddingTop: spacing.md,
  },
  avatarSection: {
    alignItems: "center",
    gap: spacing.sm,
    paddingVertical: spacing.md,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 30,
    fontWeight: "700",
    color: colors.white,
  },
  email: {
    fontSize: 16,
    color: colors.textSecondary,
    fontWeight: "500",
  },
  subscriptionCard: {
    gap: spacing.xs,
  },
  subscriptionBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  subscriptionBadgeText: {
    fontSize: 17,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  subscriptionDetail: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  actionsCard: {
    padding: 0,
    overflow: "hidden",
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    gap: spacing.md,
  },
  actionIcon: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.secondaryBackground,
    alignItems: "center",
    justifyContent: "center",
  },
  actionIconDanger: {
    backgroundColor: colors.verdictAvoidBg,
  },
  actionText: {
    flex: 1,
    fontSize: 16,
    fontWeight: "500",
    color: colors.textPrimary,
  },
  actionTextDanger: {
    color: colors.error,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginHorizontal: spacing.md,
  },
  deleteNote: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: "center",
    paddingHorizontal: spacing.xl,
  },
  conditionCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  conditionIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },
  conditionInfo: {
    flex: 1,
  },
  conditionCardLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  conditionCardValue: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.textPrimary,
    marginTop: 2,
  },
  freeBadge: {
    backgroundColor: colors.secondaryBackground,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs / 2,
  },
  freeBadgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.textSecondary,
  },
  upgradeCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    gap: spacing.md,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  starContainer: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: "#FEF4DC",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
  },
  upgradeTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: colors.textPrimary,
    textAlign: "center",
  },
  upgradeSubtitle: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: "center",
  },
  benefits: {
    gap: spacing.sm,
    paddingVertical: spacing.xs,
  },
  benefitRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  benefitText: {
    fontSize: 15,
    color: colors.textPrimary,
    fontWeight: "500",
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "center",
    gap: 4,
  },
  price: {
    fontSize: 34,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  period: {
    fontSize: 16,
    color: colors.textSecondary,
    fontWeight: "500",
  },
});

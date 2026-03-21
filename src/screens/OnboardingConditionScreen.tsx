import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList, UserCondition } from "../types";
import { useUserProfile } from "../hooks/useUserProfile";
import {
  colors,
  spacing,
  borderRadius,
  buttonStyle,
  buttonTextStyle,
} from "../styles/theme";

type Props = NativeStackScreenProps<RootStackParamList, "OnboardingCondition">;

interface ConditionOption {
  value: UserCondition;
  label: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
}

const CONDITIONS: ConditionOption[] = [
  {
    value: "hashimotos",
    label: "Hashimoto's Thyroiditis",
    subtitle: "Autoimmune — focus on goitrogens, soy, gluten & iodine",
    icon: "shield-half-outline",
  },
  {
    value: "hypothyroidism",
    label: "Hypothyroidism",
    subtitle: "Underactive thyroid — focus on absorption & goitrogens",
    icon: "pulse-outline",
  },
  {
    value: "exploring",
    label: "Just Exploring",
    subtitle: "Learning about thyroid health without a diagnosis",
    icon: "search-outline",
  },
];

export default function OnboardingConditionScreen({ navigation }: Props) {
  const { setCondition } = useUserProfile();
  const [selected, setSelected] = useState<UserCondition | null>(null);
  const [saving, setSaving] = useState(false);

  async function handleContinue() {
    if (!selected) return;
    setSaving(true);
    try {
      await setCondition(selected);
      navigation.replace("OnboardingHowItWorks");
    } finally {
      setSaving(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.step}>Step 1 of 2</Text>
        <Text style={styles.headline}>What best describes{"\n"}your situation?</Text>
        <Text style={styles.subtext}>
          This personalizes how ThyraScan scores ingredients for you. You can
          change this later in your account.
        </Text>

        <View style={styles.options}>
          {CONDITIONS.map((option) => {
            const isSelected = selected === option.value;
            return (
              <TouchableOpacity
                key={option.value}
                style={[styles.option, isSelected && styles.optionSelected]}
                onPress={() => setSelected(option.value)}
                activeOpacity={0.7}
                accessibilityRole="radio"
                accessibilityState={{ selected: isSelected }}
                accessibilityLabel={`${option.label}: ${option.subtitle}`}
              >
                <View
                  style={[
                    styles.optionIcon,
                    isSelected && styles.optionIconSelected,
                  ]}
                >
                  <Ionicons
                    name={option.icon}
                    size={24}
                    color={isSelected ? colors.white : colors.primary}
                  />
                </View>
                <View style={styles.optionText}>
                  <Text
                    style={[
                      styles.optionLabel,
                      isSelected && styles.optionLabelSelected,
                    ]}
                  >
                    {option.label}
                  </Text>
                  <Text style={styles.optionSubtitle}>{option.subtitle}</Text>
                </View>
                {isSelected && (
                  <Ionicons
                    name="checkmark-circle"
                    size={22}
                    color={colors.primary}
                  />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[buttonStyle, !selected && styles.buttonDisabled]}
          onPress={handleContinue}
          disabled={!selected || saving}
          activeOpacity={0.8}
          accessibilityLabel="Continue to next step"
        >
          {saving ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text style={buttonTextStyle}>Continue</Text>
          )}
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
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
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
    marginBottom: spacing.sm,
  },
  subtext: {
    fontSize: 15,
    color: colors.textSecondary,
    lineHeight: 22,
    marginBottom: spacing.xl,
  },
  options: {
    gap: spacing.md,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.white,
  },
  optionSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  optionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },
  optionIconSelected: {
    backgroundColor: colors.primary,
  },
  optionText: {
    flex: 1,
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: 2,
  },
  optionLabelSelected: {
    color: colors.primaryDark,
  },
  optionSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  footer: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
  },
  buttonDisabled: {
    opacity: 0.45,
  },
});

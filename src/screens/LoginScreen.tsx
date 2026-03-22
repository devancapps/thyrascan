import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as AppleAuthentication from "expo-apple-authentication";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types";
import { useAuth } from "../hooks/useAuth";
import ButterflyLogo from "../components/ButterflyLogo";
import LoadingSpinner from "../components/LoadingSpinner";
import { colors, spacing, borderRadius, buttonStyle, buttonTextStyle } from "../styles/theme";

type Props = NativeStackScreenProps<RootStackParamList, "Login">;

export default function LoginScreen({ navigation }: Props) {
  const { signIn, signUp, signInWithApple } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [appleAvailable, setAppleAvailable] = useState(false);

  React.useEffect(() => {
    AppleAuthentication.isAvailableAsync().then(setAppleAvailable);
  }, []);

  async function handleEmailAuth() {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Missing info", "Please enter your email and password.");
      return;
    }
    setLoading(true);
    try {
      if (isSignUp) {
        await signUp(email.trim(), password);
      } else {
        await signIn(email.trim(), password);
      }
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Authentication failed.";
      Alert.alert("Error", message);
    } finally {
      setLoading(false);
    }
  }

  async function handleAppleSignIn() {
    setLoading(true);
    try {
      await signInWithApple();
    } catch (error: unknown) {
      const code = (error as { code?: string }).code;
      const message = (error as { message?: string }).message;
      console.error("[AppleSignIn] failed:", code, message);
      if (code !== "ERR_REQUEST_CANCELED") {
        Alert.alert("Error", `${code ?? "unknown"}: ${message ?? "no message"}`);
      }
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <LoadingSpinner fullScreen message="Signing in..." />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.logoRow}>
            <View style={styles.logoWrap}>
              <ButterflyLogo size={36} />
            </View>
            <Text style={styles.appName}>ThyraScan</Text>
          </View>

          <View style={styles.header}>
            <Text style={styles.title}>
              {isSignUp ? "Create account" : "Welcome back"}
            </Text>
            <Text style={styles.subtitle}>
              {isSignUp
                ? "Start scanning thyroid-friendly foods"
                : "Sign in to continue scanning"}
            </Text>
          </View>

          <View style={styles.form}>
            <TextInput
              style={styles.input}
              placeholder="Email address"
              placeholderTextColor={colors.textSecondary}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              autoComplete="email"
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor={colors.textSecondary}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoComplete={isSignUp ? "new-password" : "current-password"}
            />

            <TouchableOpacity
              style={buttonStyle}
              onPress={handleEmailAuth}
              activeOpacity={0.8}
            >
              <Text style={buttonTextStyle}>
                {isSignUp ? "Create Account" : "Sign In"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.toggleButton}
              onPress={() => setIsSignUp(!isSignUp)}
            >
              <Text style={styles.toggleText}>
                {isSignUp
                  ? "Already have an account? Sign In"
                  : "Don't have an account? Sign Up"}
              </Text>
            </TouchableOpacity>
          </View>

          {appleAvailable && (
            <View style={styles.appleSection}>
              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>or</Text>
                <View style={styles.dividerLine} />
              </View>
              <AppleAuthentication.AppleAuthenticationButton
                buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
                buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
                cornerRadius={borderRadius.button}
                style={styles.appleButton}
                onPress={handleAppleSignIn}
              />
            </View>
          )}

          <Text style={styles.disclaimer}>
            For educational purposes only. Not a medical device.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xl,
    gap: spacing.lg,
  },
  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  logoWrap: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },
  appName: {
    fontSize: 22,
    fontWeight: "800",
    color: colors.textPrimary,
    letterSpacing: -0.3,
  },
  header: {
    alignItems: "center",
    gap: spacing.xs,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: colors.textPrimary,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: "center",
    fontWeight: "500",
  },
  form: {
    gap: spacing.md,
  },
  input: {
    height: 54,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    fontSize: 16,
    color: colors.textPrimary,
    backgroundColor: colors.secondaryBackground,
    fontWeight: "500",
  },
  toggleButton: {
    alignItems: "center",
    paddingVertical: spacing.xs,
  },
  toggleText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: "700",
  },
  appleSection: {
    gap: spacing.md,
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: "600",
  },
  appleButton: {
    height: 56,
    width: "100%",
  },
  disclaimer: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: "center",
    fontWeight: "500",
    marginTop: spacing.xs,
  },
});

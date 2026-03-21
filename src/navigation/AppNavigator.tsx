import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types";
import { useAuth } from "../hooks/useAuth";
import { useSubscription } from "../hooks/useSubscription";
import { useUserProfile } from "../hooks/useUserProfile";
import LoadingSpinner from "../components/LoadingSpinner";
import OnboardingWelcomeScreen from "../screens/OnboardingWelcomeScreen";
import OnboardingConditionScreen from "../screens/OnboardingConditionScreen";
import OnboardingHowItWorksScreen from "../screens/OnboardingHowItWorksScreen";
import LoginScreen from "../screens/LoginScreen";
import MainTabNavigator from "./MainTabNavigator";
import ScannerScreen from "../screens/ScannerScreen";
import ResultScreen from "../screens/ResultScreen";
import PaywallScreen from "../screens/PaywallScreen";
import DisclaimerScreen from "../screens/DisclaimerScreen";
import { colors } from "../styles/theme";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  const { user, loading: authLoading } = useAuth();
  const { loading: subscriptionLoading, loadedForUserId } = useSubscription();
  const { onboardingCompleted, loading: profileLoading } = useUserProfile();

  if (authLoading) {
    return <LoadingSpinner fullScreen message="Loading..." />;
  }

  // For authenticated users, wait for subscription AND profile to be ready.
  // This prevents rendering subscription-dependent UI with stale data.
  if (user) {
    const subscriptionReady = !subscriptionLoading && loadedForUserId === user.uid;
    if (!subscriptionReady || profileLoading) {
      return <LoadingSpinner fullScreen message="Loading..." />;
    }
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
        animation: "slide_from_right",
      }}
    >
      {user ? (
        <>
          {!onboardingCompleted ? (
            // Post-login onboarding: condition select → how it works
            <>
              <Stack.Screen name="OnboardingCondition" component={OnboardingConditionScreen} />
              <Stack.Screen name="OnboardingHowItWorks" component={OnboardingHowItWorksScreen} />
            </>
          ) : (
            // Main app
            <>
              <Stack.Screen name="MainTabs" component={MainTabNavigator} />
              <Stack.Screen
                name="Scanner"
                component={ScannerScreen}
                options={{ animation: "slide_from_bottom" }}
              />
              <Stack.Screen name="Result" component={ResultScreen} />
              <Stack.Screen
                name="Paywall"
                component={PaywallScreen}
                options={{ presentation: "modal", animation: "slide_from_bottom" }}
              />
              <Stack.Screen name="Disclaimer" component={DisclaimerScreen} />
            </>
          )}
        </>
      ) : (
        // Unauthenticated
        <>
          <Stack.Screen name="OnboardingWelcome" component={OnboardingWelcomeScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}

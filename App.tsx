import React, { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider, useAuth } from "./src/hooks/useAuth";
import { SubscriptionProvider, useSubscription } from "./src/hooks/useSubscription";
import { UserProfileProvider, useUserProfile } from "./src/hooks/useUserProfile";
import AppNavigator from "./src/navigation/AppNavigator";
import { initRevenueCat } from "./src/services/revenueCat";

// Hold the splash until we explicitly hide it.
SplashScreen.preventAutoHideAsync();
SplashScreen.setOptions({ fade: true, duration: 400 });

// Kick off RevenueCat SDK at module load — before any component mounts.
initRevenueCat().catch(console.warn);

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <SubscriptionProvider>
          <UserProfileProvider>
            <NavigationContainer>
              <AppNavigatorWithSplash />
              <StatusBar style="dark" />
            </NavigationContainer>
          </UserProfileProvider>
        </SubscriptionProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

/**
 * Thin wrapper around AppNavigator that hides the splash screen once all
 * three providers (auth, subscription, profile) have finished loading.
 * Must live inside the providers so it can read their hooks.
 */
function AppNavigatorWithSplash() {
  const { loading: authLoading } = useAuth();
  const { loading: subscriptionLoading } = useSubscription();
  const { loading: profileLoading } = useUserProfile();

  const appReady = !authLoading && !subscriptionLoading && !profileLoading;

  useEffect(() => {
    if (appReady) {
      SplashScreen.hideAsync();
    }
  }, [appReady]);

  return <AppNavigator />;
}

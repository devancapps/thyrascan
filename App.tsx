import React from "react";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider } from "./src/hooks/useAuth";
import { SubscriptionProvider } from "./src/hooks/useSubscription";
import { UserProfileProvider } from "./src/hooks/useUserProfile";
import AppNavigator from "./src/navigation/AppNavigator";
import { initRevenueCat } from "./src/services/revenueCat";

// Kick off RevenueCat SDK at module load — before any component mounts.
initRevenueCat().catch(console.warn);

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <SubscriptionProvider>
          <UserProfileProvider>
            <NavigationContainer>
              <AppNavigator />
              <StatusBar style="dark" />
            </NavigationContainer>
          </UserProfileProvider>
        </SubscriptionProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

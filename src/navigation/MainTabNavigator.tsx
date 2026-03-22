import React from "react";
import { View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { MainTabParamList } from "../types";
import HomeScreen from "../screens/HomeScreen";
import HistoryScreen from "../screens/HistoryScreen";
import AccountScreen from "../screens/ProfileScreen";
import ButterflyLogo from "../components/ButterflyLogo";
import { colors } from "../styles/theme";

const Tab = createBottomTabNavigator<MainTabParamList>();

function ScanTabIcon({ color, focused }: { color: string; focused: boolean }) {
  return (
    <View
      style={{
        width: 44,
        height: 44,
        borderRadius: 14,
        backgroundColor: focused ? colors.primaryLight : "transparent",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <ButterflyLogo
        size={focused ? 22 : 20}
        color={focused ? colors.primary : color}
        accentColor={focused ? colors.coral : color}
      />
    </View>
  );
}

export default function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.white,
          borderTopColor: colors.border,
          paddingBottom: 10,
          height: 88,
          paddingTop: 10,
          shadowColor: colors.primaryDark,
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.05,
          shadowRadius: 8,
          elevation: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "700",
          marginTop: 2,
        },
      }}
    >
      <Tab.Screen
        name="Scan"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <ScanTabIcon color={color} focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="History"
        component={HistoryScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="time-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Account"
        component={AccountScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-circle-outline" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

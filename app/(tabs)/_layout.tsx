import { Tabs } from "expo-router";
import React from "react";
import { View, StyleSheet, Platform } from "react-native";
import { BlurView } from "expo-blur";
import {
  MaterialCommunityIcons,
  MaterialIcons,
  Feather,
} from "@expo/vector-icons";

import { HapticTab } from "@/components/haptic-tab";
import { Colors } from "@/constants/theme";
import { useTheme } from "@/contexts/ThemeContext";
import { StatisticsProvider } from "@/contexts/StatisticsContext";
import { useTasks } from "@/hooks/useTasks";

const TAB_BAR_HEIGHT = 60;

const hexWithAlpha = (hex: string, alpha: number) => {
  const sanitized = hex.replace("#", "");
  const bigint = parseInt(sanitized, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const icons = {
  tasks: (color: string, size: number) => (
    <Feather name="check-square" size={size} color={color} />
  ),
  stats: (color: string, size: number) => (
    <MaterialCommunityIcons name="chart-bell-curve" size={size} color={color} />
  ),
  settings: (color: string, size: number) => (
    <MaterialIcons name="tune" size={size} color={color} />
  ),
};

export default function TabLayout() {
  const { activeTheme } = useTheme();
  const { tasks } = useTasks();
  const isDark = activeTheme === "dark";
  const colors = Colors[activeTheme];

  return (
    <StatisticsProvider tasks={tasks}>
      <Tabs

        screenOptions={{
          tabBarActiveTintColor: Colors[activeTheme].primary,
          tabBarInactiveTintColor: Colors[activeTheme].textSecondary,
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarStyle: [
            styles.tabBar,
            {
              backgroundColor: colors.card,
            },
          ],
          tabBarItemStyle: styles.tabBarItem,
          tabBarLabelStyle: styles.tabBarLabel,
          tabBarIconStyle: styles.tabBarIcon,
          lazy: true, // Only load tabs when they're accessed
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Tasks",
            tabBarIcon: ({ color, size }) =>
              icons.tasks(color, (size ?? 22) * 0.95),
          }}
        />
        <Tabs.Screen
          name="statistics"
          options={{
            title: "Statistics",
            tabBarIcon: ({ color, size }) =>
              icons.stats(color, (size ?? 22) * 0.95),
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: "Settings",
            tabBarIcon: ({ color, size }) =>
              icons.settings(color, (size ?? 22) * 0.95),
          }}
        />
      </Tabs>
    </StatisticsProvider>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: TAB_BAR_HEIGHT,
    paddingHorizontal: 8,
    justifyContent: "space-around",
    margin: 8,
    borderRadius: 24,
    borderWidth: 0,
  },
  tabBarItem: {
    paddingVertical: 4,
  },
  tabBarLabel: {
    fontSize: 13,
    fontWeight: "600",
    marginTop: 1,
    textAlign: "center",
  },
  tabBarIcon: {
    marginTop: 0,
  },
});

import { Tabs } from "expo-router";
import React from "react";

import { IconSymbol } from "@/components/Elements";

import { TabsHeader } from "@/components/pageParts/tabsLayOutHeader";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function TabLayout() {
  const colorScheme = useColorScheme() as "light" | "dark";

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme].tint,
        tabBarStyle: {
          backgroundColor: Colors[colorScheme].tabBackground,
          borderTopColor: Colors[colorScheme].tabIcon,
          height: 125,
        },
        tabBarInactiveTintColor: Colors[colorScheme].tabIconDefault,
        tabBarLabelStyle: {
          fontSize: 14,
          fontFamily: "VazirMedium",
          marginTop: 0,
        },
        tabBarIconStyle: {
          marginBottom: 0,
          marginTop: 10,
          height: 40,
          width: 40,
          justifyContent: "center",
        },
        tabBarItemStyle: {
          paddingVertical: 0,
          paddingHorizontal: 0,
        },
        tabBarShowLabel: true,
        tabBarHideOnKeyboard: true,

        // ---  Custom Header
        headerShown: true,
        headerTintColor: Colors[colorScheme].tint,
        headerTransparent: true,
        header: () => <TabsHeader />,
      }}
      initialRouteName="spending"
    >
      <Tabs.Screen
        name="spending"
        options={{
          title: "هزینه",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={35} name="data-saver-off" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="income"
        options={{
          title: "درآمد",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={35} name="attach-money" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

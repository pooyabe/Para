import { Tabs } from 'expo-router';
import React from 'react';

import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme() as "light" | "dark";

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme].tint,
        headerShown: false,
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
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "هزینه",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={35} name="data-saver-on" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
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

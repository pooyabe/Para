import { Tabs } from "expo-router";
import React from "react";

import { Div, IconSymbol, Span } from "@/components";

import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Image } from "react-native";

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
        headerTitle: () => (
          <Div style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <Image
              source={require("@/assets/images/icon.png")}
              alt="Para"
              style={{
                width: 50,
                height: 50,
                borderRadius: 8,
                objectFit: "cover",
              }}
            />
            <Span type="title" style={{ fontSize: 25, fontWeight: "normal" }}>
              پارا
            </Span>
          </Div>
        ),
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

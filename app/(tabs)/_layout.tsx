import { Tabs } from "expo-router";
import React, { type ReactNode } from "react";
import { Dimensions, StyleSheet } from "react-native";

import { Div, IconSymbol } from "@/components/Elements";

import { TabsHeader } from "@/components/pageParts/tabsLayOutHeader";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useSafeAreaInsets } from "react-native-safe-area-context";

/**
 * Shared wrapper for every tab icon.
 * Gives the selected tab a soft pill behind its icon so the active tab is
 * obvious even before reading the label.
 */
function TabIcon({
  focused,
  children,
}: {
  focused: boolean;
  children: ReactNode;
}) {
  const colors = Colors[useColorScheme()];

  return (
    <Div
      style={[
        styles.iconPill,
        focused && { backgroundColor: colors.tabIconActiveBackground },
      ]}
    >
      {children}
    </Div>
  );
}

export default function TabLayout() {
  const colorScheme = useColorScheme() as "light" | "dark";
  const ScreenHeight = Dimensions.get("window").height;

  const insets = useSafeAreaInsets();

  const colors = Colors[colorScheme];

  // --- Tab bar sizing ------------------------------------------------------
  // Proportional to the screen but clamped, so the bar stays comfortable on
  // small phones and does not grow huge on tablets.
  const tabBarHeight = Math.min(Math.max(ScreenHeight * 0.078, 60), 70);

  // The system navigation area (gesture bar or 3 button navigation) is added
  // to the bar height, so the tabs never end up behind the system buttons.
  const bottomInset = Math.max(insets.bottom, 8);

  // Icons / labels scale with the device, inside readable bounds.
  const iconSize = Math.min(Math.max(ScreenHeight * 0.027, 19), 23);
  const labelSize = Math.min(Math.max(ScreenHeight * 0.0135, 10), 12);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.theGreen,
        tabBarInactiveTintColor: colors.tabIcon,
        tabBarStyle: {
          backgroundColor: colors.tabBackground,
          borderTopWidth: StyleSheet.hairlineWidth,
          borderTopColor: colors.tabBorder,
          height: tabBarHeight + bottomInset,
          paddingTop: 6,
          paddingBottom: bottomInset,
          elevation: 12,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -3 },
          shadowOpacity: 0.18,
          shadowRadius: 8,
        },
        tabBarLabelStyle: {
          fontSize: labelSize,
          lineHeight: labelSize + 5,
          fontFamily: "VazirMedium",
          marginTop: 2,
          marginBottom: 0,
          textAlign: "center",
        },
        tabBarIconStyle: {
          marginTop: 0,
          marginBottom: 0,
        },
        tabBarItemStyle: {
          paddingVertical: 0,
          paddingHorizontal: 0,
        },
        tabBarShowLabel: true,
        tabBarHideOnKeyboard: true,

        // ---  Custom Header
        headerShown: true,
        headerTintColor: colors.tint,
        headerTransparent: true,
        header: () => <TabsHeader />,
      }}
      // Spending is the third of five tabs, so it sits in the middle of the bar
      // and opens first when the app starts.
      initialRouteName="spending"
    >
      {/* Left end */}
      <Tabs.Screen
        name="settings"
        options={{
          title: "تنظیمات",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon focused={focused}>
              <IconSymbol
                type="Ionicons"
                name={focused ? "settings" : "settings-outline"}
                size={iconSize}
                color={color}
              />
            </TabIcon>
          ),
        }}
      />
      {/* Left of spending */}
      <Tabs.Screen
        name="reports"
        options={{
          title: "گزارش",
          // The reports stack brings its own header.
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon focused={focused}>
              <IconSymbol
                type="Ionicons"
                name={focused ? "stats-chart" : "stats-chart-outline"}
                size={iconSize}
                color={color}
              />
            </TabIcon>
          ),
        }}
      />
      {/* Middle / default */}
      <Tabs.Screen
        name="spending"
        options={{
          title: "هزینه",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon focused={focused}>
              <IconSymbol
                type="Ionicons"
                name={focused ? "cart" : "cart-outline"}
                size={iconSize}
                color={color}
              />
            </TabIcon>
          ),
        }}
      />
      <Tabs.Screen
        name="income"
        options={{
          title: "درآمد",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon focused={focused}>
              <IconSymbol
                type="Ionicons"
                name={focused ? "cash" : "cash-outline"}
                size={iconSize}
                color={color}
              />
            </TabIcon>
          ),
        }}
      />
      <Tabs.Screen
        name="loans"
        options={{
          title: "بده‌بستون",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon focused={focused}>
              <IconSymbol
                type="MaterialIcons"
                name="account-balance-wallet"
                size={iconSize}
                color={color}
              />
            </TabIcon>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconPill: {
    width: 40,
    height: 26,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },
});

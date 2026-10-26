import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { Colors } from "@/constants/Colors";
import { initializeDatabase } from "@/hooks/DB";
import { useColorScheme } from "@/hooks/useColorScheme";
import { ThemeProvider } from "@/hooks/useTheme";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Toaster } from "sonner-native";

export default function RootLayout() {
  useEffect(() => {
    /**
     * This effect is for initializing the database.
     * It runs once when the component mounts.
     * The `initializeDatabase` function is responsible for setting up the database.
     */
    initializeDatabase();
  }, []);

  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    VazirRegular: require("../assets/fonts/Vazir-Regular.ttf"),
    VazirMedium: require("../assets/fonts/Vazir-Medium.ttf"),
    VazirSemiBold: require("../assets/fonts/Vazir-SemiBold.ttf"),
    VazirBold: require("../assets/fonts/Vazir-Bold.ttf"),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <ThemeProvider>
      <SafeAreaProvider>
        <GestureHandlerRootView>
          <RootNavigator />
        </GestureHandlerRootView>
      </SafeAreaProvider>
    </ThemeProvider>
  );
}

/**
 * The app shell, split from the root layout so it can use the theme context.
 */
function RootNavigator() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];

  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: colors.background,
          },
          animation: "fade",
          animationMatchesGesture: true,
          animationTypeForReplace: "pop",
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="+not-found" />
      </Stack>
      <Toaster
        style={{
          backgroundColor: colors.text,
          borderRadius: 100,
        }}
        styles={{
          title: {
            fontFamily: "VazirSemiBold",
            direction: "rtl",
            color: colors.background,
            textAlign: "left",
          },
          toastContainer: {
            direction: "ltr",
          },
        }}
        position="top-center"
      />
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
    </>
  );
}

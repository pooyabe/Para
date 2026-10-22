import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { Colors } from "@/constants/Colors";
import { initializeDatabase } from "@/hooks/DB";
import { useColorScheme } from "@/hooks/useColorScheme";
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
  const colorScheme = useColorScheme() as "light" | "dark";

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
    <SafeAreaProvider>
      <GestureHandlerRootView>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: {
              backgroundColor:
                colorScheme === "dark"
                  ? Colors["dark"].background
                  : Colors["light"].background,
            },
            animation: "fade",
            animationMatchesGesture: true,
            animationTypeForReplace: "pop",
          }}
        >
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="(reports)" />
          <Stack.Screen name="+not-found" />
        </Stack>
        <Toaster
          style={{
            backgroundColor: Colors[colorScheme].text,
            borderRadius: 100,
          }}
          styles={{
            title: {
              fontFamily: "VazirSemiBold",
              direction: "rtl",
              color: Colors[colorScheme].tabBackground,
              textAlign: "left",
            },
            toastContainer: {
              direction: "ltr",
            },
          }}
          position="top-center"
        />
        <StatusBar style="light" />
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}

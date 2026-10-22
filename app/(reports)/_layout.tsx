import { Stack } from "expo-router";
import "react-native-reanimated";

import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function RootLayout() {
  const colorScheme = useColorScheme() as "light" | "dark";

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor:
            colorScheme === "dark"
              ? Colors["dark"].background
              : Colors["light"].background,
        },
      }}
    >
      <Stack.Screen name="report" />
      <Stack.Screen name="transactionsList" />
    </Stack>
  );
}

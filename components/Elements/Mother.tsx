import { useThemeColor } from "@/hooks/useThemeColor";
import { ReactNode } from "react";
import { ScrollView, StyleSheet, View, type ViewProps } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export type MotherProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
  children: ReactNode;
  scrollable?: boolean;
};

export function Mother({
  style,
  lightColor,
  darkColor,
  children,
  scrollable = false,
  ...otherProps
}: MotherProps) {
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "background"
  );

  return (
    <SafeAreaView
      style={[{ backgroundColor }, styles.container, style]}
      {...otherProps}
    >
      {scrollable ? (
        <ScrollView contentContainerStyle={styles.inner}>{children}</ScrollView>
      ) : (
        <View style={styles.inner}>{children}</View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    paddingHorizontal: 30,
  },
  inner: {
    flexGrow: 1,
    paddingVertical: 20,
  },
});

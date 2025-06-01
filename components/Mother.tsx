import { ScrollView, StyleSheet, type ViewProps } from "react-native";

import { useThemeColor } from "@/hooks/useThemeColor";

export type MotherProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export function Mother({
  style,
  lightColor,
  darkColor,
  ...otherProps
}: MotherProps) {
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "background"
  );

  return (
    <ScrollView
      contentContainerStyle={[{ backgroundColor }, style]}
      {...otherProps}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

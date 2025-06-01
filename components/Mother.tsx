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
      contentContainerStyle={[{ backgroundColor }, styles.container, style]}
      {...otherProps}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flex: 1,
    width: "100%",
    height: "100%",
  },
});

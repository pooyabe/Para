import { useThemeColor } from "@/hooks/useThemeColor";
import { ReactNode } from "react";
import { Dimensions, StyleSheet, type ViewProps } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export type MotherProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
  children: ReactNode;
  _Hpadding?: number;
};

export function Mother({
  style,
  lightColor,
  darkColor,
  children,
  _Hpadding = 35,
  ...otherProps
}: MotherProps) {
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "background"
  );

  return (
    <SafeAreaView
      style={[
        { backgroundColor, paddingHorizontal: _Hpadding },
        styles.container,
        style,
      ]}
      {...otherProps}
    >
      {children}
    </SafeAreaView>
  );
}

const windowWith = Dimensions.get("screen").width;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flex: 1,
    width: windowWith,
  },
});

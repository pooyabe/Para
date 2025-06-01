import { useThemeColor } from "@/hooks/useThemeColor";
import { StyleSheet, TextInput, type TextInputProps } from "react-native";

export type InputProps = TextInputProps & {
  type?: "text" | "number";
};

export function Input({ style, type = "text", ...rest }: InputProps) {
  return (
    <TextInput
      style={[styles.themeColors, styles.defaultTextInputStyle, style]}
      {...rest}
    />
  );
}

/**
 *
 * Styles
 *
 */

// Theme styles
const borderColor = useThemeColor({}, "border");
const textColor = useThemeColor({}, "text");

const styles = StyleSheet.create({
  defaultTextInputStyle: {
    height: 60,
    width: "100%",
    borderWidth: 1.5,
    paddingHorizontal: 10,
    fontSize: 16,
    fontFamily: "VazirRegular",
    backgroundColor: "transparent",
    borderRadius: 100,
    textAlign: "center",
    writingDirection: "rtl",
    direction: "rtl",
  },
  themeColors: {
    borderColor,
    color: textColor,
  },
});

import { useThemeColor } from "@/hooks/useThemeColor";
import { StyleSheet, TextInput, type TextInputProps } from "react-native";
import { Span } from "./Span";

export type InputProps = TextInputProps & {
  type?: "PersianText" | "EnglishText" | "number";
};

export function Input({ style, type = "text", ...rest }: InputProps) {
  return (
    <>
      <Span></Span>
      <TextInput
        style={[
          styles.themeColors, // theme styles
          styles.defaultTextInputStyle, // The default styles
          style, // User defined style
          // The direction type style
          type === "number" || type === "EnglishText" ? styles.ltr : undefined,
          type === "PersianText" ? styles.rtl : undefined,
        ]}
        {...rest}
      />
    </>
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
    borderWidth: 1.5,
    paddingHorizontal: 50,
    fontSize: 18,
    fontFamily: "VazirRegular",
    backgroundColor: "transparent",
    borderRadius: 100,
    textAlign: "center",
    width: "80%",
  },
  themeColors: {
    borderColor,
    color: textColor,
  },

  ltr: {
    direction: "ltr",
  },
  rtl: {
    direction: "rtl",
  },
});

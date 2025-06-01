import { useThemeColor } from "@/hooks/useThemeColor";
import { StyleSheet, TextInput, View, type TextInputProps } from "react-native";
import { Span } from "./Span";

export type InputProps = TextInputProps & {
  type?: "PersianText" | "EnglishText" | "number";
  label?: null | string;
};

export function Input({
  style,
  type = "PersianText",
  label = null,
  ...rest
}: InputProps) {
  // Theme color retrive
  const textColor = useThemeColor({}, "text");

  const placeholderColor = useThemeColor({}, "placeHolderColor");

  return (
    <View style={styles.inputGroup}>
      <Span style={styles.overLabel}>{label}</Span>
      <TextInput
        placeholderTextColor={placeholderColor}
        style={[
          { color: textColor },
          styles.defaultTextInputStyle, // The default styles
          style, // User defined style
          // The direction type style
          type === "number" || type === "EnglishText" ? styles.ltr : undefined,
          type === "PersianText" ? styles.rtl : undefined,
        ]}
        {...rest}
      />
    </View>
  );
}

/**
 *
 * Styles
 *
 */

// Theme styles
const borderColor = useThemeColor({}, "border");

const styles = StyleSheet.create({
  inputGroup: {
    borderWidth: 1.5,
    width: "80%",
    borderRadius: 100,
    borderColor,
    zIndex: 1,
    height: 60,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 10,
  },
  defaultTextInputStyle: {
    width: "100%",
    height: "100%",
    paddingHorizontal: 50,
    fontSize: 18,
    fontFamily: "VazirRegular",
    backgroundColor: "transparent",
    textAlign: "center",
    zIndex: 1,
  },

  ltr: {
    direction: "ltr",
  },
  rtl: {
    direction: "rtl",
  },

  /**
   *
   * Label Style
   *
   */
  overLabel: {
    backgroundColor: "rgb(24, 31, 47)",
    zIndex: 2,
    alignSelf: "flex-end",
    marginRight: 50,
    marginLeft: 50,
    paddingRight: 5,
    paddingLeft: 5,
  },
});

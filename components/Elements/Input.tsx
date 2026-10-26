import { useThemeColor } from "@/hooks/useThemeColor";
import { StyleSheet, TextInput, View, type TextInputProps } from "react-native";
import { Span } from "./Span";

export type InputProps = TextInputProps & {
  type?: "PersianText" | "EnglishText" | "number";
  label?: null | string;
  placeholder?: null | string;
};

export function Input({
  style,
  type = "PersianText",
  label = null,
  placeholder = "",
  ...rest
}: InputProps) {
  // Define the KeyBoard Type
  // Determine keyboardType based on type
  let keyboardType: "default" | "numeric" = "default";
  if (type === "number") keyboardType = "numeric";
  else if (type === "EnglishText" || type === "PersianText")
    keyboardType = "default";

  // Theme color retrive
  const textColor = useThemeColor({}, "text");
  const placeholderColor = useThemeColor({}, "placeHolderColor");
  const borderColor = useThemeColor({}, "border");
  const backgroundColor = useThemeColor({}, "background");

  return (
    <View style={[styles.inputGroup, { borderColor }]}>
      <Span
        style={[
          styles.overLabel,
          { backgroundColor, color: textColor },
        ]}
      >
        {label}
      </Span>
      <TextInput
        placeholder={placeholder}
        placeholderTextColor={placeholderColor}
        style={[
          { color: textColor },
          styles.defaultTextInputStyle, // The default styles
          style, // User defined style
          // The direction type style
          type === "number" || type === "EnglishText" ? styles.ltr : undefined,
          type === "PersianText" ? styles.rtl : undefined,
        ]}
        keyboardType={keyboardType}
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

const styles = StyleSheet.create({
  inputGroup: {
    borderWidth: 1.5,
    width: "100%",
    borderRadius: 100,
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
    paddingTop: 0
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
    zIndex: 2,
    alignSelf: "flex-end",
    marginRight: 50,
    marginLeft: 50,
    paddingRight: 5,
    paddingLeft: 5,
  },
});

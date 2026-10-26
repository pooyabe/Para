import { useThemeColor } from "@/hooks/useThemeColor";
import {
  StyleSheet,
  TouchableOpacity,
  type TouchableOpacityProps,
} from "react-native";
import { Span } from "./Span";

export type SButtonProps = TouchableOpacityProps & {
  text: string;
  size?: "default" | "small";
};

export function SButton({ text, style, size = "default", ...rest }: SButtonProps) {
  const tintColor = useThemeColor({}, "tint");
  const backgroundColor = useThemeColor({}, "theLightBlue");
  const textColor = useThemeColor({}, "text");

  const containerStyle = size === "small" ? styles.theButtonContainerSmall : styles.theButtonContainer;
  const textStyle = size === "small" ? styles.theButtonTextSmall : styles.theButtonText;

  return (
    <TouchableOpacity
      style={[
        containerStyle,
        { borderColor: tintColor, backgroundColor },
        style,
      ]}
      {...rest}
    >
      <Span type="default" style={[textStyle, { color: textColor }]}>
        {text}
      </Span>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  theButtonContainer: {
    width: "100%",
    height: 60,
    borderWidth: 2,
    borderRadius: 100,
    display: "flex",
    justifyContent: "center",
  },
  theButtonContainerSmall: {
    width: "auto",
    height: 32,
    borderWidth: 1.5,
    borderRadius: 50,
    display: "flex",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  theButtonText: {
    fontSize: 18,
    width: "100%",
    textAlign: "center",
  },
  theButtonTextSmall: {
    fontSize: 12,
    textAlign: "center",
  },
});

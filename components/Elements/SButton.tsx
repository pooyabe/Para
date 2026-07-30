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

const tintColor = useThemeColor({}, "tint");
const backgroundColor = useThemeColor({}, "theLightBlue");
const textColor = useThemeColor({}, "text");

export function SButton({ text, style, size = "default", ...rest }: SButtonProps) {
  const containerStyle = size === "small" ? styles.theButtonContainerSmall : styles.theButtonContainer;
  const textStyle = size === "small" ? styles.theButtonTextSmall : styles.theButtonText;

  return (
    <TouchableOpacity style={[containerStyle, style]} {...rest}>
      <Span type="default" style={textStyle}>
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
    borderColor: tintColor,
    backgroundColor: backgroundColor,
    borderRadius: 100,
    display: "flex",
    justifyContent: "center",
  },
  theButtonContainerSmall: {
    width: "auto",
    height: 32,
    borderWidth: 1.5,
    borderColor: tintColor,
    backgroundColor: backgroundColor,
    borderRadius: 50,
    display: "flex",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  theButtonText: {
    color: textColor,
    fontSize: 18,
    width: "100%",
    textAlign: "center",
  },
  theButtonTextSmall: {
    color: textColor,
    fontSize: 12,
    textAlign: "center",
  },
});

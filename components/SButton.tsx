import { useThemeColor } from "@/hooks/useThemeColor";
import {
  StyleSheet,
  TouchableOpacity,
  type TouchableOpacityProps,
} from "react-native";
import { Span } from "./Span";

export type SButtonProps = TouchableOpacityProps & {
  text: string;
};

const tintColor = useThemeColor({}, "tint");
const backgroundColor = useThemeColor({}, "theLightBlue");
const textColor = useThemeColor({}, "text");

export function SButton({ text, style, ...rest }: SButtonProps) {
  return (
    <TouchableOpacity style={[styles.theButtonContainer, style]}>
      <Span type="defaultBold" style={styles.theButtonText}>
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
  theButtonText: {
    color: textColor,
    fontSize: 20,
    width: "100%",
    textAlign: "center",
  },
});

import { useThemeColor } from "@/hooks/useThemeColor";
import {
    StyleSheet,
    TouchableOpacity,
    type TouchableOpacityProps,
} from "react-native";
import { Span } from "./Span";

export type GButtonProps = TouchableOpacityProps & {
  text: string;
  onPress?: () => void;
  active?: boolean;
};

const tintColor = useThemeColor({}, "tint");
const inActiveBackgroundColor = useThemeColor({}, "tabBackground");
const activeBackgroundColor = useThemeColor({}, "theLightBlue");
const textColor = useThemeColor({}, "text");

export function GButton({
  text,
  style,
  onPress,
  active = false,
  ...rest
}: GButtonProps) {
  return (
    <TouchableOpacity
      style={[
        styles.theButtonContainer,
        active ? styles.activeButton : styles.inactiveButton,
        style,
      ]}
      {...rest}
    >
      <Span type="default" style={styles.theButtonText}>
        {text}
      </Span>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  theButtonContainer: {
    borderWidth: 0,
    borderRadius: 100,
    display: "flex",
    justifyContent: "center",
    paddingRight: 20,
    paddingLeft: 20,
  },
  theButtonText: {
    color: textColor,
    fontSize: 15,
    width: "100%",
    textAlign: "center",
  },
  activeButton: {
    backgroundColor: activeBackgroundColor,
  },
  inactiveButton: {
    backgroundColor: inActiveBackgroundColor,
  },
});

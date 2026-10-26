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

export function GButton({
  text,
  style,
  onPress,
  active = false,
  ...rest
}: GButtonProps) {
  const inActiveBackgroundColor = useThemeColor({}, "buttonBackground");
  const activeBackgroundColor = useThemeColor({}, "theLightBlue");
  const textColor = useThemeColor({}, "text");

  return (
    <TouchableOpacity
      style={[
        styles.theButtonContainer,
        {
          backgroundColor: active
            ? activeBackgroundColor
            : inActiveBackgroundColor,
        },
        style,
      ]}
      onPress={onPress}
      {...rest}
    >
      <Span type="default" style={[styles.theButtonText, { color: textColor }]}>
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
    fontSize: 14,
    width: "100%",
    textAlign: "center",
  },
});

import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import type { ComponentProps } from "react";
import { OpaqueColorValue, StyleProp, TextStyle } from "react-native";

type IoniconsName = ComponentProps<typeof Ionicons>["name"];
type MaterialIconsName = ComponentProps<typeof MaterialIcons>["name"];

type IconSymbolProps =
  | {
      type: "Ionicons";
      name: IoniconsName;
      size?: number;
      color: string | OpaqueColorValue;
      style?: StyleProp<TextStyle>;
    }
  | {
      type?: "MaterialIcons"; // default type
      name: MaterialIconsName;
      size?: number;
      color: string | OpaqueColorValue;
      style?: StyleProp<TextStyle>;
    };

export function IconSymbol(props: IconSymbolProps) {
  const { size = 24, color, style } = props;
  if (props.type === "Ionicons") {
    return (
      <Ionicons
        name={props.name as IoniconsName}
        size={size}
        color={color}
        style={style}
      />
    );
  } else {
    return (
      <MaterialIcons
        name={props.name as MaterialIconsName}
        size={size}
        color={color}
        style={style}
      />
    );
  }
}

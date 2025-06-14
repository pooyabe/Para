// Fallback for using MaterialIcons on Android and web.

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { OpaqueColorValue, type StyleProp, type TextStyle } from "react-native";

/**
 * An icon component that uses native SF Symbols on iOS, and Material Icons on Android and web.
 */
import type { ComponentProps } from "react";

export function IconSymbol({
  name,
  size = 24,
  color,
  style,
  type = "MaterialIcon",
}: {
  name: ComponentProps<typeof MaterialIcons>["name"];
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  type?: string;
}) {
  switch (type) {
    case "MaterialIcon":
      return (
        <MaterialIcons color={color} size={size} name={name} style={style} />
      );
    default:
      return (
        <MaterialIcons color={color} size={size} name={name} style={style} />
      );
  }
}

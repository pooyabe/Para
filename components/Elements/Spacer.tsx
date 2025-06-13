import { View, type ViewProps } from "react-native";

export type SpacerProps = ViewProps & { height?: number };

export function Spacer({ height = 50 }: SpacerProps) {
  return <View style={{ height: height, width: "100%" }} />;
}

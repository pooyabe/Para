import { View, type ViewProps } from "react-native";

export type DivProps = ViewProps & {};

export function Div({ style, children, ...otherProps }: ViewProps) {
  return (
    <View style={style} {...otherProps}>
      {children}
    </View>
  );
}

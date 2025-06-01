import { View, type ViewProps } from "react-native";


export type DivProps = ViewProps & {};

export function Div({ style, ...otherProps }: DivProps) {
  return <View style={style} {...otherProps} />;
}

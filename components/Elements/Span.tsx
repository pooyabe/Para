import { StyleSheet, Text, type TextProps } from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';

export type SpanProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link' | 'defaultBold' | 'defaultMedium';
};

export function Span({
  style,
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}: SpanProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return (
    <Text
      style={[
        { color },
        type === "default" ? styles.default : undefined,
        type === "title" ? styles.title : undefined,
        type === "defaultSemiBold" ? styles.defaultSemiBold : undefined,
        type === "defaultBold" ? styles.defaultBold : undefined,
        type === "defaultMedium" ? styles.defaultMedium : undefined,
        type === "subtitle" ? styles.subtitle : undefined,
        type === "link" ? styles.link : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: "VazirRegular",
  },
  defaultMedium: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: "VazirMedium",
  },
  defaultSemiBold: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: "VazirSemiBold",
  },
  defaultBold: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: "VazirBold",
  },
  title: {
    fontSize: 32,
    fontFamily: "VazirBold",
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 12,
    fontFamily: "VazirRegular",
  },
  link: {
    lineHeight: 30,
    fontSize: 16,
    color: "#0a7ea4",
    fontFamily: "VazirRegular",
  },
});

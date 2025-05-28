/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#0a7ea4';
const tintColorDark = "rgb(201,251,255)";

export const Colors = {
  light: {
    text: "#11181C",
    background: "#fff",
    tint: tintColorLight,
    icon: "#687076",
    tabIconDefault: "#687076",
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: "#ECEDEE",
    background: "#2e3440",
    tint: tintColorDark,

    // Bottom Tab Colors
    tabIcon: "#9BA1A6",
    tabBackground: "#3b4252",
    tabIconDefault: "rgba(201,251,255, 0.4)",
    tabIconSelected: tintColorDark,
  },
};

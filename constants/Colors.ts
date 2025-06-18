/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = "#0a7ea4";
const tintColorDark = "rgb(201,251,255)";

export const Colors = {
  light: {
    text: "#11181C",
    background: "#fff",
    tint: tintColorLight,
    icon: "#687076",
    border: "rgb(24, 31, 47)",
    placeHolderColor: "#11181C",
    theDarkBlue: "#1f6bb6",
    theLightBlue: "#118dff",
    theGreen: "#20fb8e",
    theOrange: "#ECA72C",
    // Bottom Tab Colors
    tabIconDefault: "#687076",
    tabIconSelected: tintColorLight,
    tabIcon: "#9BA1A6",
    tabBackground: "rgb(59, 66, 82)",
  },
  dark: {
    text: "#ECEDEE",
    background: "rgb(24, 31, 47)",
    tint: tintColorDark,
    border: "#d6dbdf",
    placeHolderColor: "rgba(201,251,255,0.4)",
    theDarkBlue: "#1f6bb6",
    theLightBlue: "#118dff",
    theGreen: "#20fb8e",
    theOrange: "#ECA72C",
    // Bottom Tab Colors
    tabIcon: "#9BA1A6",
    tabBackground: "rgb(59, 66, 82)",
    tabIconDefault: "rgba(201,251,255, 0.4)",
    tabIconSelected: tintColorDark,
  },
};

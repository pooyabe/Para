/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = "#0a7ea4";
const tintColorDark = "rgb(201,251,255)";

const light = {
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
  theRed: "#d32f2f",
  // Money colors
  income: "#1a9c5b",
  // Secondary text / labels
  muted: "#687076",
  // Soft backgrounds for badges and info boxes
  infoBackground: "rgba(17, 141, 255, 0.12)",
  successBackground: "rgba(26, 156, 91, 0.12)",
  warningBackground: "rgba(236, 167, 44, 0.12)",
  dangerBackground: "rgba(211, 47, 47, 0.12)",
  // Surfaces
  surface: "#f2f5f8",
  card: "rgba(24, 31, 47, 0.05)",
  cardAlt: "rgba(24, 31, 47, 0.035)",
  buttonBackground: "rgba(24, 31, 47, 0.08)",
  divider: "rgba(24, 31, 47, 0.12)",
  // Modals
  overlay: "rgba(0, 0, 0, 0.35)",
  modalBackground: "rgba(255, 255, 255, 0.97)",
  // Bottom Tab Colors
  tabIconDefault: "#687076",
  tabIconSelected: tintColorLight,
  tabIcon: "#9BA1A6",
  tabBackground: "rgb(59, 66, 82)",
  tabBorder: "rgba(155, 161, 166, 0.35)",
  tabIconActiveBackground: "rgba(32, 251, 142, 0.16)",
};

/**
 * The dark theme mirrors the light theme's keys, so a color can never be
 * missing from one of the two schemes. TypeScript enforces this.
 */
const dark: typeof light = {
  text: "#ECEDEE",
  background: "rgb(24, 31, 47)",
  tint: tintColorDark,
  icon: "#9BA1A6",
  border: "#d6dbdf",
  placeHolderColor: "rgba(201,251,255,0.4)",
  theDarkBlue: "#1f6bb6",
  theLightBlue: "#118dff",
  theGreen: "#20fb8e",
  theOrange: "#ECA72C",
  theRed: "#F44336",
  // Money colors
  income: "#4CAF50",
  // Secondary text / labels
  muted: "#9BA1A6",
  // Soft backgrounds for badges and info boxes
  infoBackground: "rgba(17, 141, 255, 0.15)",
  successBackground: "rgba(76, 175, 80, 0.15)",
  warningBackground: "rgba(255, 193, 7, 0.1)",
  dangerBackground: "rgba(244, 67, 54, 0.15)",
  // Surfaces
  surface: "#232d3c",
  card: "rgba(255, 255, 255, 0.1)",
  cardAlt: "rgba(255, 255, 255, 0.05)",
  buttonBackground: "rgb(59, 66, 82)",
  divider: "rgba(255, 255, 255, 0.1)",
  // Modals
  overlay: "rgba(0, 0, 0, 0.5)",
  modalBackground: "rgba(24, 31, 47, 0.95)",
  // Bottom Tab Colors
  tabIcon: "#9BA1A6",
  tabBackground: "rgb(59, 66, 82)",
  tabIconDefault: "rgba(201,251,255, 0.4)",
  tabIconSelected: tintColorDark,
  tabBorder: "rgba(155, 161, 166, 0.35)",
  tabIconActiveBackground: "rgba(32, 251, 142, 0.16)",
};

export const Colors = { light, dark };

export type ThemeName = keyof typeof Colors;

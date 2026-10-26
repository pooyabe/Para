import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useColorScheme as useSystemColorScheme } from "react-native";

import { getSetting } from "@/hooks/DB/actions/getSetting";
import { setSetting } from "@/hooks/DB/actions/setSetting";

export type ThemePreference = "light" | "dark" | "system";
export type ColorScheme = "light" | "dark";

/** The key used to store the selected theme inside the app settings table. */
export const THEME_SETTING_KEY = "theme";

/** The order of the theme options, used by the settings page. */
export const THEME_PREFERENCES: ThemePreference[] = ["light", "dark", "system"];

type ThemeContextValue = {
  themePreference: ThemePreference;
  colorScheme: ColorScheme;
  setThemePreference: (preference: ThemePreference) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

const isThemePreference = (value: string | null): value is ThemePreference =>
  value === "light" || value === "dark" || value === "system";

export function ThemeProvider({
  children,
  defaultPreference = "dark",
}: {
  children: ReactNode;
  defaultPreference?: ThemePreference;
}) {
  const systemColorScheme = useSystemColorScheme();
  const [themePreference, setThemePreferenceState] =
    useState<ThemePreference>(defaultPreference);

  // Load the saved theme once the app starts.
  useEffect(() => {
    let isMounted = true;

    getSetting(THEME_SETTING_KEY).then((savedPreference) => {
      if (isMounted && isThemePreference(savedPreference)) {
        setThemePreferenceState(savedPreference);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const setThemePreference = useCallback((preference: ThemePreference) => {
    setThemePreferenceState(preference);
    setSetting(THEME_SETTING_KEY, preference);
  }, []);

  // "system" follows the device appearance, everything else is explicit.
  const systemScheme: ColorScheme =
    systemColorScheme === "light" || systemColorScheme === "dark"
      ? systemColorScheme
      : "dark";
  const colorScheme: ColorScheme =
    themePreference === "system" ? systemScheme : themePreference;

  const value = useMemo(
    () => ({ themePreference, colorScheme, setThemePreference }),
    [themePreference, colorScheme, setThemePreference]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

/**
 * Access the app theme. Falls back to the dark theme when used outside of the
 * ThemeProvider, which is the app's original behaviour.
 */
export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);

  if (!context) {
    return {
      themePreference: "dark",
      colorScheme: "dark",
      setThemePreference: () => {},
    };
  }

  return context;
}

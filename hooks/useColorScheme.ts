import { useTheme } from "@/hooks/useTheme";

/**
 * Returns the active color scheme of the app.
 * It respects the saved theme preference (light / dark / system).
 */
export function useColorScheme(): "light" | "dark" {
  return useTheme().colorScheme;
}

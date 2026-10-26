import {
  Div,
  IconSymbol,
  Mother,
  Radio,
  Spacer,
  Span,
} from "@/components/Elements";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import {
  THEME_PREFERENCES,
  useTheme,
  type ThemePreference,
} from "@/hooks/useTheme";
import { StyleSheet } from "react-native";

const THEME_LABELS: Record<ThemePreference, string> = {
  light: "روشن",
  dark: "تیره",
  system: "سیستم",
};

const THEME_HINTS: Record<ThemePreference, string> = {
  light: "برنامه همیشه با تم روشن باز می‌شه.",
  dark: "برنامه همیشه با تم تیره باز می‌شه.",
  system: "تم بر اساس تنظیمات دستگاهت انتخاب می‌شه.",
};

export default function SettingsPage() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];

  const { themePreference, setThemePreference } = useTheme();

  const selectedIndex = Math.max(THEME_PREFERENCES.indexOf(themePreference), 0);

  return (
    <Mother>
      <Div style={styles.container}>
        <Spacer height={40} />

        <Span type="title" style={styles.pageTitle}>
          تنظیمات
        </Span>

        <Spacer height={30} />

        <Div
          style={[
            styles.card,
            {
              backgroundColor: colors.card,
              borderColor: colors.divider,
            },
          ]}
        >
          <Div style={styles.cardHeader}>
            <IconSymbol
              type="Ionicons"
              name="color-palette-outline"
              size={22}
              color={colors.tint}
            />
            <Span type="defaultSemiBold" style={styles.cardTitle}>
              ظاهر برنامه
            </Span>
          </Div>

          <Radio
            Items={THEME_PREFERENCES.map(
              (preference) => THEME_LABELS[preference],
            )}
            selectedIndex={selectedIndex}
            onChangeValueWithIndex={(value, index) => {
              setThemePreference(THEME_PREFERENCES[index]);
            }}
          />

          <Spacer height={15} />

          <Span type="subtitle" style={[styles.hint, { color: colors.muted }]}>
            {THEME_HINTS[themePreference]}
          </Span>
        </Div>
      </Div>
    </Mother>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    direction: "rtl",
  },
  pageTitle: {
    fontSize: 24,
    alignSelf: "flex-end",
  },
  card: {
    width: "100%",
    borderRadius: 20,
    borderWidth: 1,
    padding: 20,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    columnGap: 10,
  },
  cardTitle: {
    fontSize: 18,
  },
  hint: {
    textAlign: "right",
  },
});

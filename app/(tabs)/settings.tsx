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
import Constants from "expo-constants";
import { router } from "expo-router";
import { ScrollView, StyleSheet, TouchableOpacity } from "react-native";

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
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Div style={styles.container}>
          <Spacer height={20} />

          <Div style={styles.pageHeader}>
            <IconSymbol
              type="Ionicons"
              name="settings-outline"
              size={26}
              color={colors.tint}
            />
            <Span type="title" style={styles.pageTitle}>
              تنظیمات
            </Span>
          </Div>

          <Spacer height={30} />

          {/* Appearance */}
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

              <Span type="defaultSemiBold"></Span>
            </Div>
            <Div style={{ direction: "ltr" }}>
              <Radio
                Items={THEME_PREFERENCES.map(
                  (preference) => THEME_LABELS[preference],
                )}
                selectedIndex={selectedIndex}
                onChangeValueWithIndex={(value, index) => {
                  setThemePreference(THEME_PREFERENCES[index]);
                }}
              />
            </Div>

            <Spacer height={15} />

            <Span
              type="subtitle"
              style={[styles.hint, { color: colors.muted }]}
            >
              {THEME_HINTS[themePreference]}
            </Span>
          </Div>

          <Spacer height={20} />

          {/* Data: export, import, wipe */}
          <TouchableOpacity
            accessibilityRole="button"
            onPress={() => router.navigate("/data")}
            style={[
              styles.card,
              styles.navigationCard,
              { backgroundColor: colors.card, borderColor: colors.divider },
            ]}
          >
            <IconSymbol
              type="Ionicons"
              name="file-tray-full-outline"
              size={22}
              color={colors.tint}
            />
            <Span type="defaultSemiBold" style={styles.cardTitle}>
              داده‌ها و پشتیبان
            </Span>
            <IconSymbol
              type="Ionicons"
              name="chevron-back-outline"
              size={20}
              color={colors.muted}
            />
          </TouchableOpacity>

          <Spacer height={20} />

          <TouchableOpacity
            accessibilityRole="button"
            onPress={() => router.navigate("/help")}
            style={[
              styles.card,
              styles.navigationCard,
              { backgroundColor: colors.card, borderColor: colors.divider },
            ]}
          >
            <IconSymbol
              type="Ionicons"
              name="book-outline"
              size={22}
              color={colors.tint}
            />
            <Span type="defaultSemiBold" style={styles.cardTitle}>
              راهنما
            </Span>
            <IconSymbol
              type="Ionicons"
              name="chevron-back-outline"
              size={20}
              color={colors.muted}
            />
          </TouchableOpacity>

          <Spacer height={20} />

          <TouchableOpacity
            accessibilityRole="button"
            onPress={() => router.navigate("/privacy")}
            style={[
              styles.card,
              styles.navigationCard,
              { backgroundColor: colors.card, borderColor: colors.divider },
            ]}
          >
            <IconSymbol
              type="Ionicons"
              name="shield-checkmark-outline"
              size={22}
              color={colors.tint}
            />
            <Span type="defaultSemiBold" style={styles.cardTitle}>
              حریم خصوصی
            </Span>
            <IconSymbol
              type="Ionicons"
              name="chevron-back-outline"
              size={20}
              color={colors.muted}
            />
          </TouchableOpacity>

          <Spacer height={20} />
          <Span
            type="subtitle"
            style={[styles.version, { color: colors.muted }]}
          >
            نسخه {process.env.EXPO_OS}_{Constants.expoConfig?.version}_
            {Constants.expoConfig?.android?.versionCode}
          </Span>
          <Spacer height={20} />
        </Div>
      </ScrollView>
    </Mother>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    direction: "rtl",
  },
  pageHeader: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 10,
  },
  pageTitle: {
    fontSize: 24,
    alignSelf: "stretch",
    textAlign: "right",
  },
  card: {
    width: "100%",
    borderRadius: 20,
    borderWidth: 1,
    padding: 20,
  },
  navigationCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    columnGap: 12,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    columnGap: 10,
  },
  cardTitle: {
    fontSize: 18,
  },
  version: {
    alignSelf: "center",
    textAlign: "center",
  },
  hint: {
    textAlign: "center",
    lineHeight: 18,
  },
});

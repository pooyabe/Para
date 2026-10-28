import {
  Div,
  IconSymbol,
  Mother,
  Radio,
  SButton,
  Spacer,
  Span,
} from "@/components/Elements";
import { Colors } from "@/constants/Colors";
import { useDataBackup } from "@/hooks/BackEnd/useDataBackup";
import { useColorScheme } from "@/hooks/useColorScheme";
import {
  THEME_PREFERENCES,
  useTheme,
  type ThemePreference,
} from "@/hooks/useTheme";
import Constants from "expo-constants";
import { useState } from "react";
import { Alert, ScrollView, StyleSheet, TouchableOpacity } from "react-native";

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

  const {
    exportData,
    importData,
    wipeData,
    isExporting,
    isImporting,
    isWiping,
    isBusy,
  } = useDataBackup();

  const [isBackupActionsExpanded, setIsBackupActionsExpanded] = useState(false);

  const selectedIndex = Math.max(THEME_PREFERENCES.indexOf(themePreference), 0);

  const confirmImport = () => {
    Alert.alert(
      "بازگردانی داده‌ها",
      "همه تراکنش‌ها، دسته‌بندی‌ها و وام‌های فعلی با محتوای فایل پشتیبان جایگزین می‌شن. ادامه می‌دی؟",
      [
        { text: "لغو", style: "cancel" },
        { text: "بازگردانی", style: "destructive", onPress: importData },
      ],
    );
  };

  const confirmWipe = () => {
    Alert.alert(
      "پاک کردن همه داده‌ها",
      "همه تراکنش‌ها، دسته‌بندی‌ها و وام‌ها پاک می‌شن. این کار برگشت‌پذیر نیست؛ بهتره اول یک فایل پشتیبان بگیری.",
      [
        { text: "لغو", style: "cancel" },
        { text: "پاک کن", style: "destructive", onPress: wipeData },
      ],
    );
  };

  return (
    <Mother>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Div style={styles.container}>
          <Spacer height={20} />

          <Span type="title" style={styles.pageTitle}>
            تنظیمات
          </Span>

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
          <Div
            style={[
              styles.card,
              {
                backgroundColor: colors.card,
                borderColor: colors.divider,
              },
            ]}
          >
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityState={{ expanded: isBackupActionsExpanded }}
              onPress={() =>
                setIsBackupActionsExpanded((expanded) => !expanded)
              }
              style={styles.accordionHeader}
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
                name={
                  isBackupActionsExpanded
                    ? "chevron-up-outline"
                    : "chevron-down-outline"
                }
                size={22}
                color={colors.tint}
              />
            </TouchableOpacity>

            <Spacer height={12} />

            <Span
              type="subtitle"
              style={[styles.description, { color: colors.muted }]}
            >
              برای اینکه اطلاعاتت محفوظ بمونه، می‌تونی از داده‌هات فایل پشتیبان
              بگیری و هر وقت خواستی دوباره برگردونیش. برای دیدن گزینه‌های خروجی،
              بازیابی یا پاک‌کردن اطلاعات، روی عنوان بالا بزن.
            </Span>

            {isBackupActionsExpanded && (
              <>
                <Spacer height={20} />
                <SButton
                  text={isExporting ? "در حال ساخت فایل…" : "خروجی گرفتن (CSV)"}
                  disabled={isBusy}
                  onPress={exportData}
                  style={[
                    styles.actionButton,
                    {
                      borderColor: colors.tint,
                      backgroundColor: colors.infoBackground,
                      opacity: isBusy ? 0.5 : 1,
                    },
                  ]}
                />

                <Spacer height={10} />

                <SButton
                  text={isImporting ? "در حال بازگردانی…" : "بازگردانی از فایل"}
                  disabled={isBusy}
                  onPress={confirmImport}
                  style={[
                    styles.actionButton,
                    {
                      borderColor: colors.theOrange,
                      backgroundColor: colors.warningBackground,
                      opacity: isBusy ? 0.5 : 1,
                    },
                  ]}
                />

                <Spacer height={10} />

                <SButton
                  text={isWiping ? "در حال پاک کردن…" : "پاک کردن همه داده‌ها"}
                  disabled={isBusy}
                  onPress={confirmWipe}
                  style={[
                    styles.actionButton,
                    {
                      borderColor: colors.theRed,
                      backgroundColor: colors.dangerBackground,
                      opacity: isBusy ? 0.5 : 1,
                    },
                  ]}
                />
                <Spacer height={15} />
                <Span
                  type="subtitle"
                  style={[styles.hint, { color: colors.muted }]}
                >
                  بازگردانی، داده‌های فعلی رو با فایل پشتیبان جایگزین می‌کنه. تم
                  برنامه تغییری نمی‌کنه.
                </Span>
              </>
            )}
          </Div>

          <Spacer height={30} />
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
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    columnGap: 10,
  },
  accordionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    columnGap: 10,
    minHeight: 32,
  },
  cardTitle: {
    fontSize: 18,
  },
  description: {
    direction: "rtl",
    textAlign: "justify",
    lineHeight: 22,
  },
  version: {
    alignSelf: "center",
    textAlign: "center",
  },
  actionButton: {
    borderWidth: 2,
  },
  hint: {
    textAlign: "center",
    lineHeight: 18,
  },
});

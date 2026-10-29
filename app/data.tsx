import { Div, IconSymbol, Mother, SButton, Span } from "@/components/Elements";
import { Colors } from "@/constants/Colors";
import { useDataBackup } from "@/hooks/BackEnd/useDataBackup";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useState } from "react";
import { Alert, ScrollView, StyleSheet, TouchableOpacity } from "react-native";

type SectionKey = "export" | "import" | "wipe";

type DataSection = {
  key: SectionKey;
  title: string;
  icon: "download-outline" | "cloud-upload-outline" | "trash-outline";
  hint: string;
  buttonText: string;
  onPress: () => void;
  borderColor: string;
  backgroundColor: string;
};

export default function DataPage() {
  const colors = Colors[useColorScheme()];
  const [expandedSection, setExpandedSection] = useState<SectionKey | null>(
    null,
  );

  const {
    exportData,
    importData,
    wipeData,
    isExporting,
    isImporting,
    isWiping,
    isBusy,
  } = useDataBackup();

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

  const sections: DataSection[] = [
    {
      key: "export",
      title: "خروجی گرفتن از داده‌ها",
      icon: "download-outline",
      hint: "یک فایل CSV از تراکنش‌ها، دسته‌بندی‌ها و وام‌هایت ساخته می‌شه. بعد از زدن دکمه، محل ذخیره فایل را خودت انتخاب می‌کنی و فایل فقط روی دستگاه خودت می‌مونه.",
      buttonText: isExporting ? "در حال ساخت فایل…" : "خروجی گرفتن (CSV)",
      onPress: exportData,
      borderColor: colors.tint,
      backgroundColor: colors.infoBackground,
    },
    {
      key: "import",
      title: "بازگردانی از فایل",
      icon: "cloud-upload-outline",
      hint: "فایل پشتیبان قبلی را انتخاب کن تا اطلاعاتش روی برنامه برگرده. دقت کن که بازگردانی، داده‌های فعلی را با محتوای فایل جایگزین می‌کند.",
      buttonText: isImporting ? "در حال بازگردانی…" : "بازگردانی از فایل",
      onPress: confirmImport,
      borderColor: colors.theOrange,
      backgroundColor: colors.warningBackground,
    },
    {
      key: "wipe",
      title: "پاک کردن همه داده‌ها",
      icon: "trash-outline",
      hint: "همه تراکنش‌ها، دسته‌بندی‌ها و وام‌ها از دستگاه حذف می‌شن. این کار برگشت‌پذیر نیست؛ اگر به اطلاعات نیاز داری، اول یک فایل پشتیبان بگیر.",
      buttonText: isWiping ? "در حال پاک کردن…" : "پاک کردن همه داده‌ها",
      onPress: confirmWipe,
      borderColor: colors.theRed,
      backgroundColor: colors.dangerBackground,
    },
  ];

  return (
    <Mother style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <Span type="title" style={styles.pageTitle}>
          داده‌ها و پشتیبان
        </Span>
        <Span style={[styles.intro, { color: colors.muted }]}>
          برای دیدن توضیح هر بخش، روی عنوان آن بزن.
        </Span>
        {sections.map((section) => {
          const expanded = expandedSection === section.key;
          return (
            <Div
              key={section.key}
              style={[
                styles.card,
                { backgroundColor: colors.card, borderColor: colors.divider },
              ]}
            >
              <TouchableOpacity
                accessibilityRole="button"
                accessibilityState={{ expanded }}
                onPress={() =>
                  setExpandedSection(expanded ? null : section.key)
                }
                style={styles.accordionHeader}
              >
                <IconSymbol
                  type="Ionicons"
                  name={section.icon}
                  size={22}
                  color={colors.tint}
                />
                <Span type="defaultSemiBold" style={styles.sectionTitle}>
                  {section.title}
                </Span>
                <IconSymbol
                  type="Ionicons"
                  name={expanded ? "chevron-up-outline" : "chevron-down-outline"}
                  size={22}
                  color={colors.tint}
                />
              </TouchableOpacity>
              {expanded && (
                <>
                  <Span style={[styles.body, { color: colors.text }]}>
                    {section.hint}
                  </Span>
                  <SButton
                    text={section.buttonText}
                    disabled={isBusy}
                    onPress={section.onPress}
                    style={[
                      styles.actionButton,
                      {
                        borderColor: section.borderColor,
                        backgroundColor: section.backgroundColor,
                        opacity: isBusy ? 0.5 : 1,
                      },
                    ]}
                  />
                </>
              )}
            </Div>
          );
        })}
      </ScrollView>
    </Mother>
  );
}

const styles = StyleSheet.create({
  container: { direction: "rtl" },
  content: { paddingTop: 12, paddingBottom: 32, rowGap: 16 },
  pageTitle: { fontSize: 26, textAlign: "right" },
  intro: { fontSize: 14, lineHeight: 24, textAlign: "right" },
  card: { borderWidth: 1, borderRadius: 20, padding: 18, rowGap: 12 },
  accordionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    columnGap: 10,
    minHeight: 32,
  },
  sectionTitle: { flex: 1, fontSize: 16 },
  body: { textAlign: "right", lineHeight: 26, fontSize: 14 },
  actionButton: { borderWidth: 2 },
});

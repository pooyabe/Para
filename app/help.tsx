import { Div, IconSymbol, Mother, Span } from "@/components/Elements";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity } from "react-native";

const sections = [
  {
    title: "ثبت هزینه",
    icon: "cart-outline" as const,
    body: "برای ثبت هزینه، مبلغ را وارد کن، دسته‌بندی و میزان اهمیت را انتخاب کن و تاریخ را بررسی کن. هزینه‌های ثبت‌شده در گزارش‌ها هم نمایش داده می‌شوند.",
  },
  {
    title: "ثبت درآمد",
    icon: "cash-outline" as const,
    body: "مبلغ دریافتی، دلیل دریافت، محل نگهداری پول و تاریخ را وارد کن. اگر درآمد مربوط به پس‌گرفتن طلب است، وام مربوط را انتخاب کن تا مانده آن به‌روز شود.",
  },
  {
    title: "وام و طلب",
    icon: "wallet-outline" as const,
    body: "قرض‌هایی را که داده‌ای یا گرفته‌ای اضافه کن. پرداخت‌ها و دریافت‌های مرتبط را با ثبت هزینه یا درآمد پیگیری کن؛ مانده و وضعیت تسویه در صفحه وام‌ها دیده می‌شود.",
  },
  {
    title: "گزارش‌ها",
    icon: "stats-chart-outline" as const,
    body: "بازه زمانی را انتخاب کن تا روند هزینه و درآمد، دسته‌بندی‌ها و خلاصه وام‌ها و پرداخت‌ها را ببینی. با انتخاب بازه دلخواه می‌توانی تاریخ شروع و پایان را تعیین کنی.",
  },
  {
    title: "پشتیبان‌گیری و بازیابی",
    icon: "file-tray-full-outline" as const,
    body: "از بخش تنظیمات می‌توانی فایل CSV پشتیبان بگیری یا اطلاعات را از فایل بازیابی کنی. فایل پشتیبان را در جای امن نگه دار؛ بازیابی، اطلاعات فعلی را جایگزین می‌کند.",
  },
];

export default function HelpPage() {
  const colors = Colors[useColorScheme()];
  const [expandedSection, setExpandedSection] = useState<number | null>(null);

  return (
    <Mother style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <Span type="title" style={styles.pageTitle}>
          راهنما
        </Span>
        <Span style={[styles.intro, { color: colors.muted }]}>
          برای دیدن توضیح هر بخش، روی عنوان آن بزن.
        </Span>
        {sections.map((section, index) => {
          const expanded = expandedSection === index;
          return (
            <Div
              key={section.title}
              style={[
                styles.card,
                { backgroundColor: colors.card, borderColor: colors.divider },
              ]}
            >
              <TouchableOpacity
                accessibilityRole="button"
                accessibilityState={{ expanded }}
                onPress={() => setExpandedSection(expanded ? null : index)}
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
                <Span style={[styles.body, { color: colors.text }]}>
                  {section.body}
                </Span>
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
  body: { textAlign: "right", lineHeight: 29, fontSize: 15 },
});

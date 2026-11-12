import { Div, IconSymbol, Mother, Span } from "@/components/Elements";
import { useInteractiveTour } from "@/components/Tour/TourController";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity } from "react-native";

const sections = [
  {
    title: "ثبت هزینه",
    icon: "cart-outline" as const,
    body: "برای ثبت هزینه کافیه توی بخش هزینه، مقدار پولی که خرج کردی، میزان اهمیت و تاریخش رو مشخص کنی. از بخش دسته‌بندی هم میتونی از دسته‌بندی هایی که قبلا ساختی انتخاب کنی. برای ساخت دسته‌بندی هم کافیه عنوانش رو تایپ کنی. راستی، توی همین بخش هزینه‌ها می‌تونی وام‌ها و پولایی که قرض گرفتی رو پرداخت کنی.",
  },
  {
    title: "ثبت درآمد",
    icon: "cash-outline" as const,
    body: "مبلغ دریافتی، دلیل دریافت، محل نگهداری پول و تاریخ رو وارد کن.اگر پیش کسی طلب داشتی و توی بده‌بستون ثبتش کردی و احیانا اگر روزی پس داد،‌از این قسمت می‌تونی ثبتش کنی.",
  },
  {
    title: "وام و طلب",
    icon: "wallet-outline" as const,
    body: "قرض‌هایی که دادی یا گرفتی، وام‌هات، پولای دستی، داداش هفته‌بعد پس می‌دم و... رو توی این قسمت وارد کن تا همیشه جلو چشمت باشن. می‌تونی لیست پرداختی‌ها به ترتیب تاریخ رو توی همین صفحه داشته باشی. همچنین می‌تونی یه یادآور هم تعریف کنی که سر تاریخ‌ها یا روزهای مشخصی بهت یادآوری کنیم که فلانی قرضت رو پس نداد!",
  },
  {
    title: "گزارش‌ها",
    icon: "stats-chart-outline" as const,
    body: "همون صفحه‌ایه که بازش می‌کنی تا ببینی پولات کجا رفتن و چرا چیزی نخریدی ولی باز حسابت خالی شده! اول می‌خواستم اسمش رو بذارم گریه‌دونی!",
  },
  {
    title: "پشتیبان‌گیری و بازیابی",
    icon: "file-tray-full-outline" as const,
    body: "پیشنهاد می‌کنم هر چند وقت یه بار یه سر به این بخش توی تنظیمات بزنی. از اطلاعاتت پشتیبان بگیر و یه جایی داشته باش. چون همونطور که می‌دونی پارا نمی‌خواد توی حساب کتابت سرک بکشه و اطلاعاتت رو آنلاین جایی بفرسته! هرچیزی که هست توی گوشی خودته! با این قابلیت می‌تونی داده‌های پارا رو از این گوشی ببری روی یه گوشی دیگه.",
  },
];

export default function HelpPage() {
  const colors = Colors[useColorScheme()];
  const [expandedSection, setExpandedSection] = useState<number | null>(null);
  const { startInteractiveTour } = useInteractiveTour();

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
          برای دیدن توضیح هر بخش، روی عنوانش بزن.
        </Span>

        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel="اجرای راهنمای تعاملی"
          onPress={startInteractiveTour}
          style={[
            styles.interactiveCard,
            { backgroundColor: colors.infoBackground, borderColor: colors.tint },
          ]}
        >
          <IconSymbol
            type="Ionicons"
            name="play-circle-outline"
            size={28}
            color={colors.tint}
          />
          <Div style={styles.interactiveText}>
            <Span type="defaultSemiBold">راهنمای تعاملی</Span>
            <Span type="subtitle" style={{ color: colors.muted }}>
              یه تور کوتاه روی تب‌ها و بخش‌های صفحه؛ هر وقت خواستی از نو
              ببینش.
            </Span>
          </Div>
          <IconSymbol
            type="Ionicons"
            name="chevron-back-outline"
            size={20}
            color={colors.muted}
          />
        </TouchableOpacity>

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
                  name={
                    expanded ? "chevron-up-outline" : "chevron-down-outline"
                  }
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
  pageTitle: { fontSize: 26 },
  intro: { fontSize: 14, lineHeight: 24, textAlign: "justify" },
  interactiveCard: {
    flexDirection: "row-reverse",
    alignItems: "center",
    columnGap: 12,
    borderWidth: 1,
    borderRadius: 20,
    padding: 16,
  },
  interactiveText: { flex: 1, rowGap: 4 },
  card: { borderWidth: 1, borderRadius: 20, padding: 18, rowGap: 12 },
  accordionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    columnGap: 10,
    minHeight: 32,
  },
  sectionTitle: { flex: 1, fontSize: 16 },
  body: { textAlign: "justify", lineHeight: 30, fontSize: 15 },
});

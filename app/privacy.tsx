import { Div, IconSymbol, Mother, Span } from "@/components/Elements";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { ScrollView, StyleSheet } from "react-native";

const sections = [
  {
    title: "ذخیره‌سازی فقط روی دستگاه",
    icon: "phone-portrait-outline" as const,
    body: "اطلاعات مالی، تراکنش‌ها و وام‌هایی که در پارا ثبت می‌کنی، در پایگاه داده محلی روی همین گوشی ذخیره می‌شوند و فقط برای نمایش و مدیریت اطلاعات داخل برنامه استفاده می‌شوند.",
  },
  {
    title: "هیچ بارگذاری یا ارسال به سرور نداریم",
    icon: "cloud-offline-outline" as const,
    body: "پارا کاملاً آفلاین است. برنامه اطلاعاتت را به هیچ سروری ارسال یا بارگذاری نمی‌کند و برای استفاده به حساب کاربری یا اتصال اینترنت نیاز ندارد.",
  },
  {
    title: "پشتیبان‌گیری در اختیار توست",
    icon: "document-text-outline" as const,
    body: "اگر از اطلاعات خروجی بگیری، فایل پشتیبان با انتخاب خودت در محل ذخیره‌سازی دستگاه قرار می‌گیرد. مسئول نگهداری و به‌اشتراک‌نگذاشتن آن فایل خودت هستی؛ پارا آن را جایی ارسال نمی‌کند.",
  },
  {
    title: "حذف اطلاعات",
    icon: "trash-outline" as const,
    body: "با گزینه پاک کردن همه داده‌ها در تنظیمات، اطلاعات ذخیره‌شده در برنامه از دستگاه حذف می‌شوند. این کار برگشت‌پذیر نیست؛ اگر به اطلاعات نیاز داری، پیش از آن فایل پشتیبان بگیر.",
  },
];

export default function PrivacyPolicyPage() {
  const colors = Colors[useColorScheme()];

  return (
    <Mother style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <Div style={styles.hero}>
          <Div style={[styles.iconFrame, { backgroundColor: colors.infoBackground }]}>
            <IconSymbol
              type="Ionicons"
              name="shield-checkmark-outline"
              size={42}
              color={colors.tint}
            />
          </Div>
          <Span type="title" style={styles.title}>
            سیاست حفظ حریم خصوصی
          </Span>
          <Span type="subtitle" style={[styles.tagline, { color: colors.muted }]}>
            پول و اطلاعاتت فقط مال خودته
          </Span>
        </Div>

        {sections.map((section) => (
          <Div
            key={section.title}
            style={[
              styles.card,
              { backgroundColor: colors.card, borderColor: colors.divider },
            ]}
          >
            <Div style={styles.sectionHeading}>
              <IconSymbol
                type="Ionicons"
                name={section.icon}
                size={21}
                color={colors.tint}
              />
              <Span type="defaultSemiBold" style={styles.sectionTitle}>
                {section.title}
              </Span>
            </Div>
            <Span style={[styles.body, { color: colors.text }]}>
              {section.body}
            </Span>
          </Div>
        ))}
        <Span type="subtitle" style={[styles.signoff, { color: colors.muted }]}>
          حریم خصوصی، اصل کار پاراست.
        </Span>
      </ScrollView>
    </Mother>
  );
}

const styles = StyleSheet.create({
  container: { direction: "rtl" },
  content: { paddingTop: 12, paddingBottom: 32, rowGap: 16 },
  hero: { alignItems: "center", paddingVertical: 12 },
  iconFrame: {
    width: 88,
    height: 88,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  title: { fontSize: 23, textAlign: "center" },
  tagline: { marginTop: 8, fontSize: 14 },
  card: { borderWidth: 1, borderRadius: 20, padding: 18, rowGap: 12 },
  sectionHeading: { flexDirection: "row", alignItems: "center", columnGap: 9 },
  sectionTitle: { fontSize: 17, flex: 1 },
  body: { textAlign: "right", lineHeight: 29, fontSize: 15 },
  signoff: { textAlign: "center", paddingTop: 4 },
});

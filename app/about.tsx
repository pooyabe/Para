import { Div, IconSymbol, Mother, Span } from "@/components/Elements";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Image, Linking, ScrollView, StyleSheet, TouchableOpacity } from "react-native";

const contactEmail = "pooyabehravesh@gmail.com";

export default function AboutPage() {
  const colors = Colors[useColorScheme()];

  return (
    <Mother style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <Div style={styles.hero}>
          <Div style={[styles.logoFrame, { backgroundColor: colors.infoBackground }]}>
            <Image
              source={require("@/assets/images/icon.png")}
              style={styles.logo}
            />
          </Div>
          <Span type="title" style={styles.title}>
            پارا
          </Span>
          <Span type="subtitle" style={[styles.tagline, { color: colors.muted }]}>
            مدیریت مالی، ساده و بی‌دردسر
          </Span>
        </Div>

        <Div style={[styles.card, { backgroundColor: colors.card, borderColor: colors.divider }]}>
          <Div style={styles.sectionHeading}>
            <IconSymbol type="Ionicons" name="heart-outline" size={21} color={colors.tint} />
            <Span type="defaultSemiBold" style={styles.sectionTitle}>
              داستان پارا
            </Span>
          </Div>
          <Span style={[styles.body, { color: colors.text }]}>
            پارا از یک نیاز ساده شروع شد: اینکه دخل‌وخرج روزانه‌ام را بدون
            دردسر و اصطلاحات پیچیده حسابداری ببینم. درآمدت را ثبت کن، هزینه‌هایت
            را بنویس و راحت بفهم پولت کجا رفته.
          </Span>
        </Div>

        <Div style={[styles.card, { backgroundColor: colors.card, borderColor: colors.divider }]}>
          <Div style={styles.sectionHeading}>
            <IconSymbol type="Ionicons" name="shield-checkmark-outline" size={21} color={colors.tint} />
            <Span type="defaultSemiBold" style={styles.sectionTitle}>
              حریم خصوصی
            </Span>
          </Div>
          <Span style={[styles.body, { color: colors.text }]}>
            پارا رایگان و بدون تبلیغ است؛ نیازی به ساخت حساب یا ثبت‌نام نداری.
            اطلاعاتت فقط روی دستگاه خودت ذخیره می‌شود و به جایی فرستاده نمی‌شود.
          </Span>
        </Div>

        <Div style={[styles.contactCard, { backgroundColor: colors.infoBackground, borderColor: colors.divider }]}>
          <Div style={styles.sectionHeading}>
            <IconSymbol type="Ionicons" name="chatbubble-ellipses-outline" size={21} color={colors.tint} />
            <Span type="defaultSemiBold" style={styles.sectionTitle}>
              حرفی برای گفتن داری؟
            </Span>
          </Div>
          <Span style={[styles.body, { color: colors.text }]}>
            پیشنهادها و ایده‌هایت کمک می‌کنند پارا بهتر شود. خوشحال می‌شوم ازت بشنوم:
          </Span>
          <TouchableOpacity
            accessibilityRole="link"
            onPress={() => Linking.openURL(`mailto:${contactEmail}`)}
            style={styles.emailLink}
          >
            <IconSymbol type="Ionicons" name="mail-outline" size={19} color={colors.tint} />
            <Span type="link" style={styles.emailText}>
              {contactEmail}
            </Span>
          </TouchableOpacity>
        </Div>

        <Span type="subtitle" style={[styles.signoff, { color: colors.muted }]}>
          خوش باشی و پولدار ;)
        </Span>
      </ScrollView>
    </Mother>
  );
}

const styles = StyleSheet.create({
  container: {
    direction: "rtl",
  },
  content: {
    paddingTop: 12,
    paddingBottom: 32,
    rowGap: 16,
  },
  hero: {
    alignItems: "center",
    paddingVertical: 12,
  },
  logoFrame: {
    width: 104,
    height: 104,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 22,
  },
  title: {
    fontSize: 30,
  },
  tagline: {
    marginTop: 8,
    fontSize: 14,
  },
  card: {
    borderWidth: 1,
    borderRadius: 20,
    padding: 18,
    rowGap: 12,
  },
  sectionHeading: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    columnGap: 9,
  },
  sectionTitle: {
    fontSize: 17,
  },
  body: {
    textAlign: "right",
    lineHeight: 29,
    fontSize: 15,
  },
  contactCard: {
    borderWidth: 1,
    borderRadius: 20,
    padding: 18,
    rowGap: 12,
  },
  emailLink: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    columnGap: 8,
    paddingVertical: 4,
  },
  emailText: {
    direction: "ltr",
    textAlign: "left",
  },
  signoff: {
    textAlign: "center",
    paddingTop: 4,
  },
});

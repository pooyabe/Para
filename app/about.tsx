import { Div, Mother, Span } from "@/components/Elements";
import { Dimensions, Image, ScrollView, StyleSheet } from "react-native";

const screenWidth = Dimensions.get("screen").width;
const screenHeight = Dimensions.get("screen").height;
export default function aboutPage() {
  return (
    <Mother style={styles.container} _Hpadding={0}>
      <ScrollView
        style={{ paddingHorizontal: 20 }}
        overScrollMode="always"
        fadingEdgeLength={80}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <Div style={styles.headImage}>
          <Image
            source={require("@/assets/images/icon.png")}
            style={styles.topImage}
          />
        </Div>
        <Span type="title" style={styles.titleSpan}>
          پارا
        </Span>

        <Span
          style={{
            marginTop: 20,
            fontSize: 18,
            lineHeight: 40,
            textAlign: "justify",
          }}
          type="default"
        >
          پارا از یه نیاز خیلی ساده شروع شد:
          {"\n"}
          اینکه خرج‌ و‌ دخلم رو ببینم، بدون دردسر، بدون ادا اطوار، بدون اینکه
          نصف عمرم صرف فهمیدن اصطلاحات حسابداری توی اپ‌های مدیریت مالی بشه!
          {"\n"}
          {"\n"}
          این برنامه کاملاً رایگان و آزاده. نه تبلیغ داره، نه اکانت می‌خواد، نه
          ثبت‌نام، نه سینک با سرورهای عجیب‌غریب. تمام داده‌ها فقط و فقط روی
          دستگاه خودت ذخیره می‌شن.
          {"\n"}
          هیچ چیزی جایی ارسال نمی‌شه و هیچ‌کس فضولی نمی‌کنه، خیالت راحت.
          {"\n"}
          {"\n"}
          هدف پارا اینه که مدیریت مالی رو ساده کنه. نه خبری از ترازنامه و
          بدهکار/بستانکار و این حرفاس، نه لازمِه حسابدار باشی. درآمدتو می‌زنی،
          خرجتو می‌نویسی، آخرش می‌بینی پولت کجا رفته.همین.
          {"\n"}
          ظاهر برنامه هم عمداً ساده‌ست؛ بدون آلایش و بدون امکانات الکی که فقط
          شلوغش کنم، چون راستش خودم زیاد بلد نیستم با نرم‌افزارای خیلی پرامکانات
          کار کنم.در نهایت قراره سریع بفهمی چی به چیه، نه اینکه آموزش ببینی.
          {"\n"}
          {"\n"}و در نهایت پارا یه پروژه زنده‌ست ولی خب هر وقت حال و حوصله و
          ایده داشته باشم،امکانات جدید بهش اضافه می‌کنم :))
          {"\n"}
          {"\n"}
          آها راستی اگر پیشنهادی یا ایده‌ای داشتی می‌تونی با این ایمیل در ارتباط
          باشی:
          {"\n"}
          pooyabehravesh@gmail.com
          {"\n"}
          {"\n"}
          خوش باشی و پولدار ;)
        </Span>
      </ScrollView>
    </Mother>
  );
}

const styles = StyleSheet.create({
  container: {
    direction: "rtl",
    display: "flex",
  },
  headImage: {
    width: screenWidth,
    height: screenHeight * 0.2,
  },
  topImage: {
    height: "100%",
    width: "auto",
    objectFit: "contain",
  },

  titleSpan: {
    textAlign: "center",
    fontSize: 30,
  },
});

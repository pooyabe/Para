import type { TourStep } from "react-native-interactive-tour";

export type TourArrowSide = "up" | "down";

/**
 * یک قدم تور؛ علاوه بر فیلدهای کتابخانه، جهت و محل فلش راهنما را هم نگه می‌داریم
 * تا تولتیپ فارسی بتواند فلش SVG را سمت همان المان هایلایت‌شده بکشد.
 */
export type InteractiveTourStepConfig = {
  target?: string;
  title: string;
  text: string;
  /** «target-press» یعنی کاربر باید روی همان المان واقعی بزند (مثلا تب). */
  advanceOn?: "next" | "target-press";
  placement?: "above" | "below";
  arrow?: TourArrowSide;
  /** محل افقی فلش به نسبت عرض صفحه (۰ تا ۱). */
  arrowX?: number;
};

export const INTERACTIVE_TOUR_STEPS: InteractiveTourStepConfig[] = [
  {
    title: "به پارا خوش اومدی 👋",
    text: "این یه تور کوتاهه تا ببینی هر بخش برنامه برای چیه. هر وقت خواستی ردش کن؛ بعداً هم می‌تونی از تنظیمات → راهنما دوباره اجراش کنی.",
  },
  {
    target: "tab.spending",
    title: "هزینه‌ها",
    text: "خرید، کرایه، قبض و هر خرج روزانه‌ای رو از همین تب ثبت می‌کنی. روی تب «هزینه» بزن تا بریم داخلش.",
    advanceOn: "target-press",
    placement: "above",
    arrow: "down",
    arrowX: 0.5,
  },
  {
    target: "spending.amount",
    title: "چقدر خرج کردی؟",
    text: "مبلغ رو همین‌جا وارد کن. پارا خودش مبلغ رو به حروف هم نشونت می‌ده تا اشتباه نشه.",
    placement: "below",
    arrow: "up",
  },
  {
    target: "spending.reason",
    title: "بابت چی بود؟",
    text: "دسته‌بندی خرجت رو انتخاب کن. اگه چیزی توی لیست نبود، همون‌جا تایپش کن تا به لیست اضافه بشه.",
    placement: "below",
    arrow: "up",
  },
  {
    target: "spending.importance",
    title: "چقدر مهم بود؟",
    text: "الکی، بگی نگی یا ضروری. این انتخاب توی گزارش‌ها کمکت می‌کنه بفهمی پولت صرف چه چیزهایی می‌شه.",
    placement: "below",
    arrow: "up",
  },
  {
    target: "spending.date",
    title: "تاریخ",
    text: "پیش‌فرض امروزه. اگه خرج مال روز دیگه‌ای بوده، از تقویم شمسی عوضش کن.",
    placement: "below",
    arrow: "up",
  },
  {
    target: "spending.save",
    title: "ثبت هزینه",
    text: "با همین دکمه ذخیره می‌شه. بعد از ذخیره، لیست تراکنش‌ها و گزارش‌ها هم به‌روز می‌شن.",
    placement: "above",
    arrow: "down",
  },
  {
    target: "tab.income",
    title: "درآمدها",
    text: "هر پولی که به دستت می‌رسه رو از این تب ثبت کن؛ حقوق، فروش یا پولی که یکی بهت پس داده. روی تب «درآمد» بزن.",
    advanceOn: "target-press",
    placement: "above",
    arrow: "down",
    arrowX: 0.7,
  },
  {
    target: "income.amount",
    title: "چقدر گرفتی؟",
    text: "مبلغ دریافتی رو اینجا وارد کن.",
    placement: "below",
    arrow: "up",
  },
  {
    target: "income.reason",
    title: "واسه چی گرفتی؟",
    text: "دلیل دریافت رو انتخاب یا تایپ کن تا بعداً بدونی این پول از کجا اومده.",
    placement: "below",
    arrow: "up",
  },
  {
    target: "income.destination",
    title: "کجا گذاشتی؟",
    text: "مشخص کن پول کجا نگهداری می‌شه: نقد، حساب بانکی، کیف پول و...",
    placement: "below",
    arrow: "up",
  },
  {
    target: "tab.reports",
    title: "گزارش‌ها",
    text: "اینجا می‌بینی پولات کجا می‌رن؛ نمودار هزینه‌ها، درآمدها و لیست همه تراکنش‌ها. روی تب «گزارش» بزن.",
    advanceOn: "target-press",
    placement: "above",
    arrow: "down",
    arrowX: 0.3,
  },
  {
    target: "tab.loans",
    title: "بده‌بستون",
    text: "وام، قرض و طلب‌ها رو اینجا ثبت کن و براشون یادآور بذار تا یادت نره کی باید پس بده. روی تب «بده‌بستون» بزن.",
    advanceOn: "target-press",
    placement: "above",
    arrow: "down",
    arrowX: 0.9,
  },
  {
    target: "tab.settings",
    title: "تنظیمات",
    text: "تم برنامه، دسته‌بندی‌ها، پشتیبان‌گیری، حریم خصوصی و راهنما همه اینجان. راهنمای تعاملی رو هم از تنظیمات → راهنما هر وقت خواستی دوباره اجرا کن. روی تب «تنظیمات» بزن تا تور تموم بشه.",
    advanceOn: "target-press",
    placement: "above",
    arrow: "down",
    arrowX: 0.1,
  },
];

export const TOUR_STEPS: TourStep[] = INTERACTIVE_TOUR_STEPS.map(
  ({ title, text, target, advanceOn, placement }) => ({
    title,
    text,
    target,
    advanceOn,
    tooltipPlacement: placement,
  }),
);

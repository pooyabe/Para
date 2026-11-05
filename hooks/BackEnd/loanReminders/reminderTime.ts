import type {
  LoanReminder,
  LoanReminderMode,
} from "@/hooks/DB/actions/loanReminders";
import moment from "jalali-moment";

/** ساعت ثابت ارسال یادآورها؛ در کل برنامه یکسان است. */
export const REMINDER_HOUR = 7;
export const REMINDER_MINUTE = 0;
export const REMINDER_TIME_LABEL = "۰۷:۰۰ صبح";

/**
 * تعداد ماه‌هایی که برای یادآور ماهانه از پیش در سیستم‌عامل زمان‌بندی می‌شود.
 * یادآور ماهانه با اعلان تک‌زمانی ساخته می‌شود، چون تریگر ماهانه سیستم‌عامل
 * با تقویم میلادی کار می‌کند و روز ماه شمسی را درست نمی‌شناسد.
 */
export const MONTHLY_HORIZON_MONTHS = 12;

export type ReminderDayOption = {
  label: string;
  value: number;
};

/** روزهای هفته با قرارداد expo-notifications: ۱ = یکشنبه … ۷ = شنبه. */
export const WEEKDAY_OPTIONS: ReminderDayOption[] = [
  { label: "شنبه", value: 7 },
  { label: "یک‌شنبه", value: 1 },
  { label: "دوشنبه", value: 2 },
  { label: "سه‌شنبه", value: 3 },
  { label: "چهارشنبه", value: 4 },
  { label: "پنج‌شنبه", value: 5 },
  { label: "جمعه", value: 6 },
];

export const MONTH_DAY_OPTIONS: ReminderDayOption[] = Array.from(
  { length: 31 },
  (_, index) => ({ label: toPersianDigits(index + 1), value: index + 1 }),
);

export const MODE_LABELS: Record<LoanReminderMode, string> = {
  once: "یک‌بار",
  monthly: "ماهانه",
  weekly: "هفتگی",
};

export function toPersianDigits(value: number | string): string {
  return String(value).replace(
    /[0-9]/g,
    (digit) => "۰۱۲۳۴۵۶۷۸۹"[Number(digit)],
  );
}

/** امروز در تقویم شمسی، مثل 1405/08/12 */
export function getJalaliToday(): string {
  return moment().locale("fa").format("jYYYY/jMM/jDD");
}

/** روز هفته امروز با قرارداد expo-notifications (۱ = یکشنبه). */
export function getTodayWeekday(): number {
  return new Date().getDay() + 1;
}

export function toGregorianDateString(jalaliDate: string): string {
  return moment
    .from(jalaliDate, "fa", "jYYYY/jMM/jDD")
    .locale("en")
    .format("YYYY-MM-DD");
}

export function toJalaliDateString(gregorianDate: string): string {
  return moment(gregorianDate).locale("fa").format("jYYYY/jMM/jDD");
}

/** تاریخ میلادی یادآور یک‌بار به‌همراه ساعت ثابت ۰۷:۰۰ به وقت محلی. */
export function getOnceReminderDateTime(gregorianDate: string): Date {
  const [year, month, day] = gregorianDate.split("-").map(Number);

  return new Date(year, month - 1, day, REMINDER_HOUR, REMINDER_MINUTE, 0, 0);
}

/**
 * تاریخ‌های آینده یک یادآور ماهانه بر اساس **روز ماه شمسی**.
 * ماه‌هایی که این روز را ندارند (مثل ۳۱ در ماه‌های ۳۰ روزه) رد می‌شوند.
 */
export function getMonthlyOccurrences(
  dayOfMonth: number,
  now: Date = new Date(),
): Date[] {
  if (!Number.isInteger(dayOfMonth) || dayOfMonth < 1 || dayOfMonth > 31) {
    return [];
  }

  const [todayYear, todayMonth] = getJalaliToday().split("/").map(Number);

  const occurrences: Date[] = [];
  let year = todayYear;
  let month = todayMonth;

  for (let index = 0; index < MONTHLY_HORIZON_MONTHS; index += 1) {
    const candidate = moment
      .from(`${year}/${month}/${dayOfMonth}`, "fa", "jYYYY/jMM/jDD")
      .locale("fa");

    // اگر این روز در این ماه وجود نداشته باشد، تاریخ به ماه بعد می‌غلتد.
    const existsInThisMonth =
      candidate.jMonth() + 1 === month && candidate.jDate() === dayOfMonth;

    if (existsInThisMonth) {
      const occurrence = candidate
        .hour(REMINDER_HOUR)
        .minute(REMINDER_MINUTE)
        .second(0)
        .millisecond(0)
        .toDate();

      if (occurrence.getTime() > now.getTime()) {
        occurrences.push(occurrence);
      }
    }

    month += 1;
    if (month > 12) {
      month = 1;
      year += 1;
    }
  }

  return occurrences;
}

/** توضیح خوانا برای هر یادآور، با تاریخ شمسی و ساعت ثابت ارسال. */
export function describeLoanReminder(
  reminder: Pick<
    LoanReminder,
    "mode" | "once_date" | "day_of_month" | "day_of_week"
  >,
): string {
  switch (reminder.mode) {
    case "once":
      return reminder.once_date
        ? `یک‌بار در ${toPersianDigits(
            toJalaliDateString(reminder.once_date),
          )}، ساعت ${REMINDER_TIME_LABEL}`
        : `یک‌بار، ساعت ${REMINDER_TIME_LABEL}`;
    case "monthly":
      return reminder.day_of_month
        ? `هر ماه، روز ${toPersianDigits(
            reminder.day_of_month,
          )}، ساعت ${REMINDER_TIME_LABEL}`
        : `هر ماه، ساعت ${REMINDER_TIME_LABEL}`;
    case "weekly": {
      const weekday = WEEKDAY_OPTIONS.find(
        (option) => option.value === reminder.day_of_week,
      );

      return weekday
        ? `هر هفته، ${weekday.label}، ساعت ${REMINDER_TIME_LABEL}`
        : `هر هفته، ساعت ${REMINDER_TIME_LABEL}`;
    }
    default:
      return `ساعت ${REMINDER_TIME_LABEL}`;
  }
}

/** یادآور یک‌باره‌ای که زمانش گذشته است؛ در فهرست می‌ماند و «پایان‌یافته» نشان داده می‌شود. */
export function isOneTimeReminderPassed(
  reminder: Pick<LoanReminder, "mode" | "once_date">,
): boolean {
  if (reminder.mode !== "once" || !reminder.once_date) return false;

  return getOnceReminderDateTime(reminder.once_date).getTime() <= Date.now();
}

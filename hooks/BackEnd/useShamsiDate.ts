import moment from "jalali-moment";

// The component `Date` name never shadows here, but keep an explicit reference
// so the conversion helpers stay readable.
const NativeDate = globalThis.Date;

/**
 * jalali-moment keeps a global calendar mode that `moment.from` flips while it
 * parses. A plain Gregorian string read while that mode is "Jalali primary"
 * comes back unchanged, which printed Gregorian dates in the lists. Building a
 * native Date first keeps this conversion independent of that global mode.
 */
export function parseGregorianDate(value: string | Date): Date {
  if (value instanceof NativeDate) return value;

  const [year, month, day] = value.slice(0, 10).split(/[-/]/).map(Number);

  return new NativeDate(year, (month || 1) - 1, day || 1);
}

/** تاریخ میلادی (رشته یا Date) به شمسی با قالب jYYYY/jMM/jDD */
export function toJalaliString(value: string | Date): string {
  return moment(parseGregorianDate(value))
    .locale("fa")
    .format("jYYYY/jMM/jDD");
}

/**
 * Custom hook برای کار با تاریخ شمسی
 */
export function useShamsiDate() {
  const toJalali = (date: string | Date): string => {
    return toJalaliString(date);
  };

  const toGregorian = (jalaliDate: string): string => {
    return moment
      .from(jalaliDate, "fa", "jYYYY/jMM/jDD")
      .locale("en")
      .format("YYYY-MM-DD");
  };

  const nowJalali = (): string => {
    return moment().locale("fa").format("jYYYY/jMM/jDD");
  };

  const nowGregorian = (): string => {
    return moment().format("YYYY-MM-DD");
  };

  return {
    toJalali,
    toGregorian,
    nowJalali,
    nowGregorian,
  };
}

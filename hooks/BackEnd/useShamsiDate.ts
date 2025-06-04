import moment from "jalali-moment";

/**
 * Custom hook برای کار با تاریخ شمسی
 */
export function useShamsiDate() {
  const toJalali = (date: string | Date): string => {
    return moment(date).locale("fa").format("jYYYY/jMM/jDD");
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

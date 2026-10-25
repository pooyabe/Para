import moment from "jalali-moment";

export type RangeType = "month" | "quarter" | "sixmonth" | "year" | "custom";

export type CustomRange = {
  startDate: string; // تاریخ شمسی با فرمت jYYYY/jMM/jDD (از)
  endDate: string; // تاریخ شمسی با فرمت jYYYY/jMM/jDD (تا)
};

/**
 * بازه پیش فرض برای بازه دلخواه: از اول ماه جاری تا امروز
 */
export function getDefaultCustomRange(): CustomRange {
  const today = moment().locale("fa");

  return {
    startDate: today.clone().startOf("jMonth").format("jYYYY/jMM/jDD"),
    endDate: today.format("jYYYY/jMM/jDD"),
  };
}

export async function getDateRange(
  type: RangeType,
  customRange?: CustomRange,
): Promise<{
  startDate: string; // ISO string
  endDate: string; // ISO string
}> {
  const today = moment(); // ← میلادی، هم برای کوئری هم برای حلقه
  const end = today.clone().locale("fa").endOf("day"); // ← پایان امروز، همیشه ثابت

  // ← بازه دلخواه انتخاب شده توسط کاربر
  if (type === "custom") {
    if (!customRange?.startDate || !customRange?.endDate) {
      throw new Error("Custom range needs both start and end dates");
    }

    const customStart = moment.from(
      customRange.startDate,
      "fa",
      "jYYYY/jMM/jDD",
    );
    const customEnd = moment.from(customRange.endDate, "fa", "jYYYY/jMM/jDD");

    return {
      startDate: customStart.format("jYYYY/jMM/jDD").replace(/\//g, "-"),
      endDate: customEnd.format("jYYYY/jMM/jDD").replace(/\//g, "-"),
    };
  }

  let start: moment.Moment;

  switch (type) {
    case "month":
      start = today.clone().locale("fa").startOf("month");
      break;

    case "quarter":
      start = today
        .clone()
        .locale("fa")
        .subtract(3, "month")
        .startOf("month");
      break;

    case "sixmonth":
      start = today
        .clone()
        .locale("fa")
        .subtract(6, "month")
        .startOf("month");
      break;

    case "year":
      start = today
        .clone()
        .locale("fa")
        .subtract(12, "month")
        .startOf("month");
      break;

    default:
      throw new Error("Invalid range type");
  }

  return {
    startDate: start.format("jYYYY-MM-DD"),
    endDate: end.format("jYYYY-MM-DD"),
  };
}

import moment from "jalali-moment";

export type RangeType = "month" | "quarter" | "sixmonth" | "year";

export async function getDateRange(type: RangeType): Promise<{
  startDate: string; // ISO string
  endDate: string; // ISO string
}> {
  const today = moment(); // ← میلادی، هم برای کوئری هم برای حلقه
  const end = today.clone().endOf("day"); // ← پایان امروز، همیشه ثابت

  let start: moment.Moment;

  switch (type) {
    case "month":
      start = today.clone().locale("fa").startOf("month").locale("en");
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
    startDate: start.format("YYYY-MM-DD"),
    endDate: end.format("YYYY-MM-DD"),
  };
}

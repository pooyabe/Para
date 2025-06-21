// hooks/useDateRange.ts
import moment from "jalali-moment";

export type RangeType = "month" | "quarter" | "sixmonth" | "year";

export function getDateRange(type: RangeType): {
  startDate: string; // ISO string
  endDate: string; // ISO string
} {
  const today = moment(); // امروز شمسی

  let start: moment.Moment;
  let end: moment.Moment;

  switch (type) {
    case "month":
      start = today.clone().startOf("jMonth");
      end = today.clone().endOf("jMonth");
      break;

    case "quarter":
      end = today.clone().startOf("jMonth").subtract(1, "day");
      start = end.clone().subtract(2, "jMonth").startOf("jMonth"); // سه ماه شامل ماه قبل هم باشه
      break;

    case "sixmonth":
      end = today.clone().startOf("jMonth").subtract(1, "day");
      start = end.clone().subtract(5, "jMonth").startOf("jMonth"); // سه ماه شامل ماه قبل هم باشه
      break;

    case "year":
      start = today.clone().startOf("jYear");
      end = today.clone().endOf("jYear");
      break;

    default:
      throw new Error("Invalid range type");
  }

  return {
    startDate: start.clone().locale("fa").format("YYYY-MM-DD"),
    endDate: end.clone().locale("fa").format("YYYY-MM-DD"),
  };
}

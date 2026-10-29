import {
  CustomRange,
  getDateRange,
  RangeType,
} from "@/hooks/BackEnd/useDateRange";
import moment from "jalali-moment";
import { getDbConnection } from "../helpers";

export async function getMonthlyReport(
  dataSoure: string,
  rangeKey: RangeType,
  customRange?: CustomRange,
  minimumTotal: number = 1000,
): Promise<{ value: number; label: string }[]> {
  // Connecting to data base
  const db = await getDbConnection();

  // Get the range date and set start date and end date
  const { startDate, endDate } = await getDateRange(rangeKey, customRange);

  // ← کار با تاریخ شمسی واقعی (نه تبدیل رشته میلادی)
  const start = moment.from(startDate, "fa", "jYYYY/jMM/jDD");
  const end = moment.from(endDate, "fa", "jYYYY/jMM/jDD");

  // Decalre the Promised vars
  const returnOutput: { value: number; label: string }[] = [];

  /**
   *
   * The selected period is inside one month → show it day by day
   * (هر روز یک ستون با برچسب DD/MM)
   *
   */
  const isSingleMonth = startDate.slice(0, 7) === endDate.slice(0, 7);

  if (isSingleMonth) {
    const day = start.clone();

    while (day.isSameOrBefore(end, "day")) {
      // Gregorian date of this day, for the query
      const G_Day = day.format("YYYY-MM-DD");

      const sql = `SELECT SUM(amount) as total FROM ${dataSoure} WHERE transaction_date = ?`;

      const theResult = await db.getFirstAsync<{ total: number }>(sql, [G_Day]);

      if (typeof theResult?.total === "number" && theResult.total > minimumTotal) {
        returnOutput.push({
          value: theResult.total,
          label: day.format("jDD/jMM"),
        });
      }

      day.add(1, "day");
    }
  } else {
    /**
     *
     * The selected period is in multiple months → one column per month
     * (هر ماه یک ستون با برچسب YYYY/MM)
     *
     */
    const current = start.clone().startOf("jMonth");

    while (current.isSameOrBefore(end, "day")) {
      const monthEnd = current.clone().endOf("jMonth");

      // Keep the queried days inside the selected period
      const from = current.isBefore(start, "day") ? start : current;
      const to = monthEnd.isAfter(end, "day") ? end : monthEnd;

      // Converting dates
      const GMS = from.format("YYYY-MM-DD");
      const GME = to.format("YYYY-MM-DD");

      const sql = `SELECT SUM(amount) as total FROM ${dataSoure} WHERE transaction_date BETWEEN ? AND ?`;

      const theResult = await db.getFirstAsync<{ total: number }>(sql, [
        GMS,
        GME,
      ]);

      if (typeof theResult?.total === "number" && theResult.total > minimumTotal) {
        returnOutput.push({
          value: theResult.total,
          label: current.format("jYYYY/jMM"),
        });
      }

      current.add(1, "jMonth");
    }
  }

  /**
   *
   *
   * Send results
   *
   *
   */

  return returnOutput;
}

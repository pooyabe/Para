import { getDateRange, RangeType } from "@/hooks/BackEnd/useDateRange";
import { useShamsiDate } from "@/hooks/BackEnd/useShamsiDate";
import moment from "jalali-moment";
import { getDbConnection } from "../helpers";

export async function getMonthlyReport(
  dataSoure: string,
  rangeKey: RangeType
): Promise<{ value: number; label: string }[]> {
  // Connecting to data base
  const db = await getDbConnection();

  // Use Shamsi date hook for converts
  const { toGregorian, toJalali } = useShamsiDate();

  // Get the range date and set start date and end date
  const { startDate, endDate } = await getDateRange(rangeKey);

  // Get date range in Database format
  const start = moment(startDate, "YYYY-MM-DD");
  const end = moment(endDate, "YYYY-MM-DD");

  const current = start.clone().startOf("month");

  // Declare months arrays
  const months: string[] = [];

  while (current.isSameOrBefore(end, "month")) {
    months.push(current.format("YYYY-MM-DD"));
    current.add(1, "month");
  }
  // An Extra step for this month
  months.push(current.format("YYYY-MM-DD"));
  current.add(1, "month");

  // Decalre the Promised vars
  const returnOutput = [];

  /**
   *
   * Check if the range is this month or not
   *
   */
  const isSingleMonth = rangeKey === "month";

  if (isSingleMonth) {
    const daysCount = end.diff(start, "days") + 1;

    for (let i = 0; i < daysCount; i++) {
      const day = start.clone().add(i, "days");

      const G_Day = toGregorian(day.format("YYYY-MM-DD"));

      const sql = `SELECT SUM(amount) as total FROM ${dataSoure} WHERE transaction_date = ?`;

      const theResult = await db.getFirstAsync<{ total: number }>(sql, [G_Day]);

      if (typeof theResult?.total === "number" && theResult.total > 1000) {
        returnOutput.push({
          value: theResult.total,
          label: day.format("DD/MM"),
        });
      }
    }
  } else {
    /**
     *
     * The range is not single month
     *
     */

    // Loop through all months
    // cmi : Current Month Index
    for (var cmi = 0; cmi < months.length; cmi++) {
      const monthStart = moment(months[cmi] + "-01", "YYYY-MM-DD");
      const monthEnd = monthStart.clone().endOf("month");

      // Converting dates
      const JMS = monthStart.format("YYYY-MM-DD");
      const GMS = toGregorian(JMS);
      const JME = monthEnd.format("YYYY-MM-DD");
      const GME = toGregorian(JME);

      /**
       *
       *
       *
       */
      const sql = `SELECT SUM(amount) as total FROM ${dataSoure} WHERE transaction_date BETWEEN ? AND ?`;

      const theResult = await db.getFirstAsync<{ total: number }>(sql, [
        GMS,
        GME,
      ]);

      if (typeof theResult?.total === "number" && theResult.total > 1000) {
        returnOutput.push({
          value: theResult.total,
          label: toJalali(GMS).substring(0, 7),
        });
      }
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

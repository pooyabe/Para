import { getDateRange, RangeType } from "@/hooks/BackEnd/useDateRange";
import moment from "jalali-moment";
import { getDbConnection } from "../helpers";

export async function getMonthlyReport(
  dataSoure: string,
  rangeKey: RangeType
): Promise<{
  returnOutput: { value: number; label: string }[];
}> {
  // Connecting to data base
  const db = await getDbConnection();

  // Get the range date and set start date and end date
  const the_range_date = await getDateRange(rangeKey);

  const startDate = the_range_date.startDate;
  const endDate = the_range_date.endDate;

  // Get date range in Database format
  const start = moment(startDate, "YYYY-MM-DD");
  const end = moment(endDate, "YYYY-MM-DD");

  const current = start.clone().startOf("month");

  // Declare months arrays
  const months: string[] = [];
  const monthLabels: string[] = [];

  while (current.isSameOrBefore(end, "month")) {
    monthLabels.push(current.locale("fa").format("jMM/jYYYY"));
    months.push(current.locale("en").format("YYYY-MM"));
    current.add(1, "month");
  }

  // Decalre the Promised vars
  const returnOutput: { value: number; label: string }[] = [];

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

      const sql = `SELECT SUM(amount) as total FROM ${dataSoure} WHERE transaction_date = ?`;

      const theResult = await db.getFirstAsync<{ total: number }>(sql, [
        day.format("YYYY-MM-DD"),
      ]);

      if (theResult?.total > 1000) {
        returnOutput.push({
          value: theResult?.total || 0,
          label: day.locale("fa").format("jDD"),
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

      /**
       *
       *
       *
       */
      const sql = `SELECT SUM(amount) as total FROM ${dataSoure} WHERE transaction_date BETWEEN ? AND ?`;

      const theResult = await db.getFirstAsync<{ total: number }>(sql, [
        monthStart.format("YYYY-MM-DD"),
        monthEnd.format("YYYY-MM-DD"),
      ]);

      if (theResult?.total > 1000) {
        returnOutput.push({
          value: theResult?.total || 0,
          label: monthLabels[cmi],
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

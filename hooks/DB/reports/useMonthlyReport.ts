import { getDateRange, RangeType } from "@/hooks/BackEnd/useDateRange";
import moment from "jalali-moment";
import { getDbConnection } from "../helpers";

export async function getMonthlyReport(rangeKey: RangeType): Promise<{
  spendings: { value: number; label: string }[];
  incomes: { value: number }[];
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
  const spendings: { value: number; label: string }[] = [];
  const incomes: { value: number }[] = [];

  /**
   *
   * Declare the prepared statements
   *
   */
  const spendingStatement = await db.prepareAsync(
    `SELECT SUM(amount) as total FROM spendings WHERE transaction_date BETWEEN $startDate AND $endDate`
  );

  const incomeStatement = await db.prepareAsync(
    `SELECT SUM(amount) FROM incomes WHERE transaction_date BETWEEN $startDate AND $endDate`
  );

  // Loop through all months
  // cmi : Current Month Index
  try {
    for (var cmi = 0; cmi < months.length; cmi++) {
      const monthStart = moment(months[cmi] + "-01", "YYYY-MM-DD");
      const monthEnd = monthStart.clone().endOf("month");

      /**
       *
       *
       *
       */
      const spendingResult = await db.getFirstAsync<{ total: number }>(
        `SELECT SUM(amount) as total FROM spendings WHERE transaction_date BETWEEN ? AND ?`,
        [monthStart.format("YYYY-MM-DD"), monthEnd.format("YYYY-MM-DD")]
      );

      const incomeResult = await db.getFirstAsync<{ total: number }>(
        `SELECT SUM(amount) as total FROM incomes WHERE transaction_date BETWEEN ? AND ?`,
        [monthStart.format("YYYY-MM-DD"), monthEnd.format("YYYY-MM-DD")]
      );
      

      
      spendings.push({
        value: spendingResult?.total || 0,
        label: monthLabels[cmi],
      });

      incomes.push({
        value: incomeResult?.total || 0,
      });
    }
  } finally {
    await spendingStatement.finalizeAsync();
    await incomeStatement.finalizeAsync();
  }

  /**
   *
   *
   * Send results
   *
   *
   */
  const the_return = {
    spendings,
    incomes,
  };
  return the_return;
}

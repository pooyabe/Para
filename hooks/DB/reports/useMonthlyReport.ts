import moment from "jalali-moment";
import { getDbConnection } from "../helpers";

export async function getMonthlyReport(
  startDate: string,
  endDate: string
): Promise<{
  spendings: { value: number; label: string }[];
  incomes: { value: number }[];
}> {
  const db = await getDbConnection();

  const start = moment(startDate, "YYYY-MM-DD");
  const end = moment(endDate, "YYYY-MM-DD");

  const months: string[] = [];
  const monthLabels: string[] = [];

  const current = start.clone().startOf("jMonth");

  while (current.isSameOrBefore(end, "month")) {
    months.push(current.format("YYYY-MM"));
    monthLabels.push(current.locale("fa").format("jMM/jYYYY"));
    current.add(1, "month");
  }

  const spendings: { value: number; label: string }[] = [];
  const incomes: { value: number }[] = [];

  for (let i = 0; i < months.length; i++) {
    const monthStart = moment(months[i] + "-01", "YYYY-MM-DD");
    const monthEnd = monthStart.clone().endOf("month");

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
      label: monthLabels[i],
    });

    incomes.push({
      value: incomeResult?.total || 0,
    });
  }

  return { spendings, incomes };
}

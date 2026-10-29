import {
  CustomRange,
  getDateRange,
  RangeType,
} from "@/hooks/BackEnd/useDateRange";
import { useShamsiDate } from "@/hooks/BackEnd/useShamsiDate";
import { getDbConnection } from "../helpers";
import { PieItem } from "./useSpendingPercentage";

export async function getIncomeDistribution(
  rangeKey: RangeType,
  colorRange: string[],
  customRange?: CustomRange,
): Promise<PieItem[]> {
  const db = await getDbConnection();
  const { toGregorian } = useShamsiDate();
  const { startDate, endDate } = await getDateRange(rangeKey, customRange);
  const start = toGregorian(startDate);
  const end = toGregorian(endDate);

  const totalResult = await db.getFirstAsync<{ total: number }>(
    `SELECT COALESCE(SUM(amount), 0) as total FROM incomes WHERE transaction_date BETWEEN ? AND ?`,
    [start, end],
  );
  const total = totalResult?.total ?? 0;
  if (total === 0) return [];

  const rows = await db.getAllAsync<{ title: string; amount: number }>(
    `
      SELECT COALESCE(ir.title, 'بدون دسته‌بندی') as title, SUM(i.amount) as amount
      FROM incomes i
      LEFT JOIN income_reasons ir ON i.reason_id = ir.id
      WHERE i.transaction_date BETWEEN ? AND ?
      GROUP BY i.reason_id
      ORDER BY amount DESC
    `,
    [start, end],
  );

  return rows.map((row, index) => ({
    value: Number(((row.amount * 100) / total).toFixed(1)),
    text: row.title,
    amount: row.amount,
    color: colorRange[index] ?? "#ccc",
  }));
}

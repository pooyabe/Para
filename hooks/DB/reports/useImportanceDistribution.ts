import {
  CustomRange,
  getDateRange,
  RangeType,
} from "@/hooks/BackEnd/useDateRange";
import { useShamsiDate } from "@/hooks/BackEnd/useShamsiDate";
import { getDbConnection } from "../helpers";

export type TopItem = {
  title: string;
  amount: number;
};

export type ImportanceData = {
  alkaaei: number; // الکی (0)
  alkaaeiTopItem?: TopItem;
  borderline: number; // بگی نگی (1)
  borderlineTopItem?: TopItem;
  necessary: number; // ضروری (2)
  total: number;
};

export async function getImportanceDistribution(
  rangeKey: RangeType,
  customRange?: CustomRange,
): Promise<ImportanceData> {
  const db = await getDbConnection();
  const { toGregorian } = useShamsiDate();

  const { startDate, endDate } = await getDateRange(rangeKey, customRange);

  const G_StartDate = toGregorian(startDate);
  const G_EndDate = toGregorian(endDate);

  // Get total spending by importance level
  const result = await db.getFirstAsync<{
    alkaaei: number;
    borderline: number;
    necessary: number;
    total: number;
  }>(
    `
    SELECT 
      COALESCE(SUM(CASE WHEN importance = 0 THEN amount ELSE 0 END), 0) as alkaaei,
      COALESCE(SUM(CASE WHEN importance = 1 THEN amount ELSE 0 END), 0) as borderline,
      COALESCE(SUM(CASE WHEN importance = 2 THEN amount ELSE 0 END), 0) as necessary,
      COALESCE(SUM(amount), 0) as total
    FROM spendings 
    WHERE transaction_date BETWEEN ? AND ?
    `,
    [G_StartDate, G_EndDate],
  );

  // Get top items for alkaaei (0)
  const alkaaeiTopItemResult = await db.getFirstAsync<{
    title: string;
    amount: number;
  }>(
    `
    SELECT si.title, SUM(s.amount) as amount
    FROM spendings s
    JOIN spending_items si ON s.item_id = si.id
    WHERE s.importance = 0 AND s.transaction_date BETWEEN ? AND ?
    GROUP BY s.item_id
    ORDER BY amount DESC
    LIMIT 1
    `,
    [G_StartDate, G_EndDate],
  );

  // Get top items for borderline (1)
  const borderlineTopItemResult = await db.getFirstAsync<{
    title: string;
    amount: number;
  }>(
    `
    SELECT si.title, SUM(s.amount) as amount
    FROM spendings s
    JOIN spending_items si ON s.item_id = si.id
    WHERE s.importance = 1 AND s.transaction_date BETWEEN ? AND ?
    GROUP BY s.item_id
    ORDER BY amount DESC
    LIMIT 1
    `,
    [G_StartDate, G_EndDate],
  );

  return {
    alkaaei: result?.alkaaei ?? 0,
    alkaaeiTopItem: alkaaeiTopItemResult
      ? {
          title: alkaaeiTopItemResult.title,
          amount: alkaaeiTopItemResult.amount,
        }
      : undefined,
    borderline: result?.borderline ?? 0,
    borderlineTopItem: borderlineTopItemResult
      ? {
          title: borderlineTopItemResult.title,
          amount: borderlineTopItemResult.amount,
        }
      : undefined,
    necessary: result?.necessary ?? 0,
    total: result?.total ?? 0,
  };
}

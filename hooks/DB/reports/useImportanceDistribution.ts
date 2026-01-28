import { getDateRange, RangeType } from "@/hooks/BackEnd/useDateRange";
import { useShamsiDate } from "@/hooks/BackEnd/useShamsiDate";
import { getDbConnection } from "../helpers";

export type ImportanceData = {
  alkaaei: number; // الکی (0)
  borderline: number; // بگی نگی (1)
  necessary: number; // ضروری (2)
  total: number;
};

export async function getImportanceDistribution(
  rangeKey: RangeType,
): Promise<ImportanceData> {
  const db = await getDbConnection();
  const { toGregorian } = useShamsiDate();

  const { startDate, endDate } = await getDateRange(rangeKey);

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

  return (
    result || {
      alkaaei: 0,
      borderline: 0,
      necessary: 0,
      total: 0,
    }
  );
}

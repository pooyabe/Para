import { getDateRange, RangeType } from "@/hooks/BackEnd/useDateRange";
import { getDbConnection } from "../helpers";

type SpendingCategory = {
  text: string;
  value: number; // درصد
};

export async function getSpendingPercentage(
  rangeKey: RangeType
): Promise<SpendingCategory[]> {
  const db = await getDbConnection();

  // گرفتن بازه‌ی تاریخی
  const { startDate, endDate } = await getDateRange(rangeKey);

  // مجموع کل هزینه‌ها در بازه
  const totalRow = await db.getFirstAsync<{ total: number }>(
    `SELECT SUM(amount) as total FROM spendings WHERE transaction_date BETWEEN ? AND ?`,
    [startDate, endDate]
  );

  const total = totalRow?.total || 0;

  if (total === 0) return [];

  // گرفتن هزینه‌ها به تفکیک item
  const rows = await db.getAllAsync<{
    title: string;
    total: number;
  }>(
    `
    SELECT si.title, SUM(s.amount) as total
    FROM spendings s
    JOIN spending_items si ON s.item_id = si.id
    WHERE s.transaction_date BETWEEN ? AND ?
    GROUP BY si.title
    ORDER BY total DESC
    `,
    [startDate, endDate]
  );

  if (!rows || rows.length === 0) return [];

  // اگر کمتر از 9 مورد داریم، همونا رو خروجی بده
  if (rows.length <= 9) {
    return rows.map((row) => ({
      text: row.title,
      value: Math.round((row.total / total) * 100),
    }));
  }

  // در غیر اینصورت: 8 مورد اول + سایر هزینه‌ها
  const top8 = rows.slice(0, 8);
  const others = rows.slice(8);

  const topOutput = top8.map((row) => ({
    text: row.title,
    value: Math.round((row.total / total) * 100),
  }));

  const otherTotal = others.reduce((acc, item) => acc + item.total, 0);

  topOutput.push({
    text: "سایر هزینه‌ها",
    value: Math.round((otherTotal / total) * 100),
  });

  return topOutput;
}

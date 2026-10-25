import {
  CustomRange,
  getDateRange,
  RangeType,
} from "@/hooks/BackEnd/useDateRange";
import { useShamsiDate } from "@/hooks/BackEnd/useShamsiDate";
import { getDbConnection } from "../helpers";

export type PieItem = {
  value: number; // percent
  text: string;
  color: string;
  amount: number; // raw amount
  items?: Array<{ title: string; amount: number; percent: number }>;
};

export async function getSpendingDistribution(
  rangeKey: RangeType,
  colorRange: string[],
  customRange?: CustomRange,
): Promise<PieItem[]> {
  const db = await getDbConnection();

  if (!colorRange) {
    colorRange = [
      "#118cfeff",
      "#118cfe9f",
      "#118cfe8f",
      "#118cfe7f",
      "#118cfe6f",
      "#118cfe5f",
      "#118cfe4f",
      "#118cfe3f",
      "#118cfe2f",
    ];
  }

  const { toGregorian } = useShamsiDate();

  const { startDate, endDate } = await getDateRange(rangeKey, customRange);

  const G_StartDate = toGregorian(startDate);
  const G_EndDate = toGregorian(endDate);

  // 1. گرفتن کل هزینه‌ها
  const totalRes = await db.getFirstAsync<{ total: number }>(
    `SELECT SUM(amount) as total FROM spendings WHERE transaction_date BETWEEN ? AND ?`,
    [G_StartDate, G_EndDate],
  );

  const total = totalRes?.total ?? 0;
  if (total === 0) return [];

  // 2. گرفتن مجموع هزینه به تفکیک آیتم
  const rows = await db.getAllAsync<{
    title: string;
    sum: number;
  }>(
    `
    SELECT si.title as title, SUM(s.amount) as sum
    FROM spendings s
    JOIN spending_items si ON s.item_id = si.id
    WHERE s.transaction_date BETWEEN ? AND ?
    GROUP BY s.item_id
    `,
    [G_StartDate, G_EndDate],
  );

  // 3. مرتب‌سازی نزولی بر اساس مقدار
  const sorted = rows.sort((a, b) => b.sum - a.sum);

  // 4. اگر کمتر از 9 تاست → همه رو نشون بده
  if (sorted.length <= 9) {
    return sorted.map((item, index) => ({
      value: Number(((item.sum * 100) / total).toFixed(1)),
      amount: item.sum,
      text: item.title,
      color: colorRange[index] ?? "#ccc", // fallback color
    }));
  }

  // 5. بیشتر از 9 تاست → 8 تای اول + سایر
  const top8 = sorted.slice(0, 8);
  const others = sorted.slice(8);

  const topItems = top8.map((item, index) => ({
    value: Number(((item.sum * 100) / total).toFixed(1)),
    amount: item.sum,
    text: item.title,
    color: colorRange[index],
  }));

  const othersSum = others.reduce((acc, item) => acc + item.sum, 0);

  topItems.push({
    value: Number(((othersSum * 100) / total).toFixed(1)),
    amount: othersSum,
    text: "سایر",
    color: colorRange[8],
    items: others.map((it) => ({
      title: it.title,
      amount: it.sum,
      percent: Number(((it.sum * 100) / total).toFixed(1)),
    })),
  });

  return topItems;
}

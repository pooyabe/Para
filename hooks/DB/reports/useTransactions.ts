import { getDbConnection } from "../helpers";

export interface Transaction {
  id: number;
  type: "income" | "spending";
  amount: number;
  transaction_date: string;
  reason: string;
  destination: string | null;
  importance: number | null;
  loan_id: number | null;
}

/**
 * فیلتر دسته‌بندی؛ دسته‌های هزینه و دلیل‌های درآمد در دو جدول جدا هستند، پس
 * نوع تراکنش هم همراه شناسه لازم است.
 */
export type TransactionCategoryFilter =
  | { type: "income"; id: number }
  | { type: "spending"; id: number };

export async function getTransactions(
  limit: number,
  offset: number,
  filterDate?: string,
  filterCategory?: TransactionCategoryFilter,
): Promise<Transaction[]> {
  const db = await getDbConnection();

  const dateFilter = filterDate ? `AND DATE(i.transaction_date) = ?` : "";
  const dateFilterSpending = filterDate
    ? `AND DATE(s.transaction_date) = ?`
    : "";

  // شاخه‌ای که دسته‌اش با فیلتر نمی‌خواند با «AND 1 = 0» خالی می‌شود تا
  // فیلتر دسته هزینه، تراکنش‌های درآمد را برنگرداند و برعکس.
  const categoryFilter = filterCategory
    ? filterCategory.type === "income"
      ? `AND i.reason_id = ?`
      : `AND 1 = 0`
    : "";
  const categoryFilterSpending = filterCategory
    ? filterCategory.type === "spending"
      ? `AND s.item_id = ?`
      : `AND 1 = 0`
    : "";

  const sql = `
    SELECT 'income' as type, i.id, i.amount, i.transaction_date, ir.title as reason, id.title as destination, NULL as importance, i.loan_id
    FROM incomes i
    LEFT JOIN income_reasons ir ON i.reason_id = ir.id
    LEFT JOIN income_destinations id ON i.destination_id = id.id
    WHERE 1=1 ${dateFilter} ${categoryFilter}
    UNION ALL
    SELECT 'spending' as type, s.id, s.amount, s.transaction_date, si.title as reason, NULL as destination, s.importance, s.loan_id
    FROM spendings s
    LEFT JOIN spending_items si ON s.item_id = si.id
    WHERE 1=1 ${dateFilterSpending} ${categoryFilterSpending}
    ORDER BY transaction_date DESC, 2 DESC
    LIMIT ? OFFSET ?
  `;

  // ترتیب پارامترها باید با ترتیب شاخه‌ها در کوئری یکی باشد.
  const params: (string | number)[] = [];
  if (filterDate) params.push(filterDate);
  if (filterCategory?.type === "income") params.push(filterCategory.id);
  if (filterDate) params.push(filterDate);
  if (filterCategory?.type === "spending") params.push(filterCategory.id);
  params.push(limit, offset);

  const result = await db.getAllAsync<Transaction>(sql, params);
  return result;
}

import { getDbConnection } from "../helpers";

export interface Transaction {
  id: number;
  type: "income" | "spending";
  amount: number;
  transaction_date: string;
  reason: string;
  destination: string | null;
  importance: number | null;
}

export async function getTransactions(
  limit: number,
  offset: number,
  filterDate?: string,
): Promise<Transaction[]> {
  const db = await getDbConnection();

  const dateFilter = filterDate ? `AND DATE(i.transaction_date) = ?` : "";
  const dateFilterSpending = filterDate
    ? `AND DATE(s.transaction_date) = ?`
    : "";

  const sql = `
    SELECT 'income' as type, i.id, i.amount, i.transaction_date, ir.title as reason, id.title as destination, NULL as importance
    FROM incomes i
    LEFT JOIN income_reasons ir ON i.reason_id = ir.id
    LEFT JOIN income_destinations id ON i.destination_id = id.id
    WHERE 1=1 ${dateFilter}
    UNION ALL
    SELECT 'spending' as type, s.id, s.amount, s.transaction_date, si.title as reason, NULL as destination, s.importance
    FROM spendings s
    LEFT JOIN spending_items si ON s.item_id = si.id
    WHERE 1=1 ${dateFilterSpending}
    ORDER BY transaction_date DESC
    LIMIT ? OFFSET ?
  `;

  const params = filterDate
    ? [filterDate, filterDate, limit, offset]
    : [limit, offset];
  const result = await db.getAllAsync<Transaction>(sql, params);
  return result;
}

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
): Promise<Transaction[]> {
  const db = await getDbConnection();

  const sql = `
    SELECT 'income' as type, i.id, i.amount, i.transaction_date, ir.title as reason, id.title as destination, NULL as importance
    FROM incomes i
    LEFT JOIN income_reasons ir ON i.reason_id = ir.id
    LEFT JOIN income_destinations id ON i.destination_id = id.id
    UNION ALL
    SELECT 'spending' as type, s.id, s.amount, s.transaction_date, si.title as reason, NULL as destination, s.importance
    FROM spendings s
    LEFT JOIN spending_items si ON s.item_id = si.id
    ORDER BY transaction_date DESC
    LIMIT ? OFFSET ?
  `;

  const result = await db.getAllAsync<Transaction>(sql, [limit, offset]);
  return result;
}

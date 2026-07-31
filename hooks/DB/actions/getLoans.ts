import { getDbConnection } from "../helpers";

export interface Loan {
  id: number;
  type: "receivable" | "payable";
  amount: number;
  paid_amount: number;
  source: string;
  description: string | null;
  start_date: string;
  end_date: string;
  is_settled: number;
  create_date: string;
}

export async function getLoans(
  includeSettled: boolean = false
): Promise<Loan[]> {
  const db = await getDbConnection();

  const settledFilter = includeSettled ? "" : "AND is_settled = 0";

  const sql = `
    SELECT * FROM loans
    WHERE 1=1 ${settledFilter}
    ORDER BY create_date DESC
  `;

  const result = await db.getAllAsync<Loan>(sql);
  return result;
}

export async function getLoanById(id: number): Promise<Loan | null> {
  const db = await getDbConnection();

  const result = await db.getFirstAsync<Loan>(
    `SELECT * FROM loans WHERE id = ?`,
    [id]
  );

  return result || null;
}
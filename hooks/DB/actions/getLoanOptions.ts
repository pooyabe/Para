import { getDbConnection } from "../helpers";

type LoanOption = {
  id: number;
  label: string;
  value: string; // This will be the loan ID as string for uniqueness
  type: "receivable" | "payable";
};

export async function getLoanOptions(): Promise<LoanOption[]> {
  const db = await getDbConnection();

  const rows = await db.getAllAsync<{
    id: number;
    source: string;
    type: "receivable" | "payable";
    amount: number;
    paid_amount: number;
  }>(
    `SELECT id, source, type, amount, paid_amount FROM loans WHERE is_settled = 0 ORDER BY create_date DESC`
  );

  return rows.map((row) => ({
    id: row.id,
    label: row.source,
    value: String(row.id), // Use ID as value for uniqueness
    type: row.type,
  }));
}

export async function getPayableLoanOptions(): Promise<LoanOption[]> {
  const db = await getDbConnection();

  const rows = await db.getAllAsync<{
    id: number;
    source: string;
    type: "receivable" | "payable";
    amount: number;
    paid_amount: number;
  }>(
    `SELECT id, source, type, amount, paid_amount FROM loans WHERE type = 'payable' AND is_settled = 0 ORDER BY create_date DESC`
  );

  return rows.map((row) => ({
    id: row.id,
    label: row.source,
    value: String(row.id), // Use ID as value for uniqueness
    type: row.type,
  }));
}

export async function getReceivableLoanOptions(): Promise<LoanOption[]> {
  const db = await getDbConnection();

  const rows = await db.getAllAsync<{
    id: number;
    source: string;
    type: "receivable" | "payable";
    amount: number;
    paid_amount: number;
  }>(
    `SELECT id, source, type, amount, paid_amount FROM loans WHERE type = 'receivable' AND is_settled = 0 ORDER BY create_date DESC`
  );

  return rows.map((row) => ({
    id: row.id,
    label: row.source,
    value: String(row.id), // Use ID as value for uniqueness
    type: row.type,
  }));
}
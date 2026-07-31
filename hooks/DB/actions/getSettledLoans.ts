import { getDbConnection } from "../helpers";

export interface SettledLoan {
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
  payments: Array<{
    id: number;
    amount: number;
    payment_date: string;
    type: "payment" | "receipt";
  }>;
}

export async function getSettledLoans(): Promise<SettledLoan[]> {
  const db = await getDbConnection();

  const loans = await db.getAllAsync<{
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
  }>(
    `SELECT * FROM loans WHERE is_settled = 1 ORDER BY create_date DESC`
  );

  const settledLoans: SettledLoan[] = [];

  for (const loan of loans) {
    const payments = await db.getAllAsync<{
      id: number;
      amount: number;
      payment_date: string;
      type: "payment" | "receipt";
    }>(
      `SELECT * FROM loan_payments WHERE loan_id = ? ORDER BY payment_date DESC`,
      [loan.id]
    );

    settledLoans.push({
      ...loan,
      payments,
    });
  }

  return settledLoans;
}
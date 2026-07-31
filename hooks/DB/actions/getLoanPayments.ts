import { getDbConnection } from "../helpers";

export interface LoanPayment {
  id: number;
  loan_id: number;
  amount: number;
  payment_date: string;
  type: "payment" | "receipt";
  create_date: string;
}

export async function getLoanPayments(loanId: number): Promise<LoanPayment[]> {
  const db = await getDbConnection();

  const result = await db.getAllAsync<LoanPayment>(
    `SELECT * FROM loan_payments WHERE loan_id = ? ORDER BY payment_date DESC`,
    [loanId]
  );

  return result;
}
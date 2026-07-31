import { getDbConnection } from "../helpers";

type AddLoanPaymentInput = {
  loanId: number;
  amount: number;
  paymentDate: string;
  type: "payment" | "receipt";
};

export async function addLoanPayment({
  loanId,
  amount,
  paymentDate,
  type,
}: AddLoanPaymentInput): Promise<void> {
  const db = await getDbConnection();

  await db.runAsync(
    `INSERT INTO loan_payments (loan_id, amount, payment_date, type)
     VALUES (?, ?, ?, ?)`,
    [loanId, amount, paymentDate, type]
  );

  // Update the loan's paid_amount
  await db.runAsync(
    `UPDATE loans SET paid_amount = paid_amount + ? WHERE id = ?`,
    [amount, loanId]
  );

  // Check if loan is fully settled
  const loan = await db.getFirstAsync<{ amount: number; paid_amount: number }>(
    `SELECT amount, paid_amount FROM loans WHERE id = ?`,
    [loanId]
  );

  if (loan && loan.paid_amount >= loan.amount) {
    await db.runAsync(
      `UPDATE loans SET is_settled = 1 WHERE id = ?`,
      [loanId]
    );
  }
}
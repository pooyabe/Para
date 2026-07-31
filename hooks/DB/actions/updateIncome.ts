import { getDbConnection } from "../helpers";

/**
 * دریافت ID از جدول خاص؛ در صورت نبود، درج و برگشت ID
 */
async function getOrCreateIncomeId(
  tableName: "income_reasons" | "income_destinations",
  title: string
): Promise<number> {
  const db = await getDbConnection();

  // تلاش برای پیدا کردن مقدار
  const selectResult = await db.getFirstAsync<{ id: number }>(
    `SELECT id FROM ${tableName} WHERE title = ?`,
    [title]
  );

  if (selectResult) return selectResult.id;

  // اگر نبود: درج و برگشت ID
  const insertResult = await db.runAsync(
    `INSERT INTO ${tableName} (title) VALUES (?)`,
    [title]
  );

  return insertResult.lastInsertRowId;
}

type UpdateIncomeInput = {
  id: number;
  amount: number;
  reasonTitle: string;
  destinationTitle: string;
  transactionDate: string; // ISO string
};

export async function updateIncome({
  id,
  amount,
  reasonTitle,
  destinationTitle,
  transactionDate,
}: UpdateIncomeInput): Promise<boolean> {
  try {
    const db = await getDbConnection();

    // Get the current income record to check if it's a loan receipt
    const currentIncome = await db.getFirstAsync<{ loan_id: number | null; amount: number; transaction_date: string }>(
      `SELECT loan_id, amount, transaction_date FROM incomes WHERE id = ?`,
      [id]
    );

    if (!currentIncome) {
      console.error("Income not found:", id);
      return false;
    }

    const oldAmount = currentIncome.amount;
    const oldDate = currentIncome.transaction_date;
    const loanId = currentIncome.loan_id;

    const reasonId = await getOrCreateIncomeId("income_reasons", reasonTitle);
    const destinationId = await getOrCreateIncomeId(
      "income_destinations",
      destinationTitle
    );

    await db.runAsync(
      `UPDATE incomes
       SET amount = ?, reason_id = ?, destination_id = ?, transaction_date = ?
       WHERE id = ?`,
      [amount, reasonId, destinationId, transactionDate, id]
    );

    // If this was a loan receipt, update the loan_payment and loan paid_amount
    if (loanId) {
      // Find the corresponding loan_payment record
      const loanPayment = await db.getFirstAsync<{ id: number; amount: number }>(
        `SELECT id, amount FROM loan_payments WHERE loan_id = ? AND amount = ? AND payment_date = ? AND type = 'receipt'`,
        [loanId, oldAmount, oldDate]
      );

      if (loanPayment) {
        const amountDiff = amount - oldAmount;

        // Update loan_payment record
        await db.runAsync(
          `UPDATE loan_payments SET amount = ?, payment_date = ? WHERE id = ?`,
          [amount, transactionDate, loanPayment.id]
        );

        // Update loan's paid_amount
        await db.runAsync(
          `UPDATE loans SET paid_amount = paid_amount + ? WHERE id = ?`,
          [amountDiff, loanId]
        );

        // Check if loan is fully settled
        const loan = await db.getFirstAsync<{ amount: number; paid_amount: number }>(
          `SELECT amount, paid_amount FROM loans WHERE id = ?`,
          [loanId]
        );

        if (loan) {
          const isSettled = loan.paid_amount >= loan.amount ? 1 : 0;
          await db.runAsync(
            `UPDATE loans SET is_settled = ? WHERE id = ?`,
            [isSettled, loanId]
          );
        }
      }
    }

    return true;
  } catch (error) {
    console.error("Error updating income:", error);
    return false;
  }
}
import { getDbConnection } from "../helpers";

/**
 * دریافت ID از جدول خاص؛ در صورت نبود، درج و برگشت ID
 */
async function getOrCreateId(
  tableName: "spending_items",
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

type UpdateSpendingInput = {
  id: number;
  amount: number;
  reasonTitle: string;
  importance: string;
  transactionDate: string; // ISO string
};

export async function updateSpending({
  id,
  amount,
  reasonTitle,
  importance,
  transactionDate,
}: UpdateSpendingInput): Promise<boolean> {
  try {
    const db = await getDbConnection();

    // Get the current spending record to check if it's a loan payment
    const currentSpending = await db.getFirstAsync<{ loan_id: number | null; amount: number; transaction_date: string }>(
      `SELECT loan_id, amount, transaction_date FROM spendings WHERE id = ?`,
      [id]
    );

    if (!currentSpending) {
      console.error("Spending not found:", id);
      return false;
    }

    const oldAmount = currentSpending.amount;
    const oldDate = currentSpending.transaction_date;
    const loanId = currentSpending.loan_id;

    const reasonId = await getOrCreateId("spending_items", reasonTitle);

    await db.runAsync(
      `UPDATE spendings
       SET amount = ?, item_id = ?, importance = ?, transaction_date = ?
       WHERE id = ?`,
      [amount, reasonId, importance, transactionDate, id]
    );

    // If this was a loan payment, update the loan_payment and loan paid_amount
    if (loanId) {
      // Find the corresponding loan_payment record
      const loanPayment = await db.getFirstAsync<{ id: number; amount: number }>(
        `SELECT id, amount FROM loan_payments WHERE loan_id = ? AND amount = ? AND payment_date = ? AND type = 'payment'`,
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
    console.error("Error updating spending:", error);
    return false;
  }
}
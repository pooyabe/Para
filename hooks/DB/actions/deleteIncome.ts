import { getDbConnection } from "../helpers";

export const deleteIncome = async (incomeId: number): Promise<boolean> => {
  try {
    const db = await getDbConnection();

    // Get the current income record to check if it's a loan receipt
    const currentIncome = await db.getFirstAsync<{ loan_id: number | null; amount: number; transaction_date: string }>(
      `SELECT loan_id, amount, transaction_date FROM incomes WHERE id = ?`,
      [incomeId]
    );

    if (!currentIncome) {
      console.error("Income not found:", incomeId);
      return false;
    }

    const loanId = currentIncome.loan_id;
    const amount = currentIncome.amount;
    const transactionDate = currentIncome.transaction_date;

    // If this was a loan receipt, update the loan_payment and loan paid_amount
    if (loanId) {
      // Find the corresponding loan_payment record
      const loanPayment = await db.getFirstAsync<{ id: number }>(
        `SELECT id FROM loan_payments WHERE loan_id = ? AND amount = ? AND payment_date = ? AND type = 'receipt'`,
        [loanId, amount, transactionDate]
      );

      if (loanPayment) {
        // Delete the loan_payment record
        await db.runAsync(`DELETE FROM loan_payments WHERE id = ?`, [loanPayment.id]);

        // Update loan's paid_amount (subtract the amount)
        await db.runAsync(
          `UPDATE loans SET paid_amount = paid_amount - ? WHERE id = ?`,
          [amount, loanId]
        );

        // Check if loan is no longer settled
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

    // Delete the income record
    await db.runAsync("DELETE FROM incomes WHERE id = ?", [incomeId]);
    return true;
  } catch (error) {
    console.error("Error deleting income:", error);
    return false;
  }
};

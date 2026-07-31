import { getDbConnection } from "../helpers";
import { addLoanPayment, getLoanById } from "..";

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

type AddSpendingInput = {
  amount: number;
  reasonTitle: string;
  importance: string;
  transactionDate: string; // ISO string
};

export async function addSpending({
  amount,
  reasonTitle,
  importance,
  transactionDate,
}: AddSpendingInput): Promise<void> {
  const db = await getDbConnection();

  // Check if reasonTitle is a loan ID (numeric string)
  const loanId = parseInt(reasonTitle, 10);
  const isLoanPayment = !isNaN(loanId);

  if (isLoanPayment) {
    // This is a loan payment - verify the loan exists and is payable
    const loan = await getLoanById(loanId);
    if (loan && loan.type === "payable") {
      // Add loan payment
      await addLoanPayment({
        loanId,
        amount,
        paymentDate: transactionDate,
        type: "payment",
      });
    }
    // Still record the spending for tracking
    const reasonId = await getOrCreateId("spending_items", `پرداخت وام: ${loan?.source || "نامشخص"}`);

    await db.runAsync(
      `INSERT INTO spendings (amount, item_id, importance, transaction_date)
       VALUES (?, ?, ?, ?)`,
      [amount, reasonId, importance, transactionDate]
    );
  } else {
    // Regular spending
    const reasonId = await getOrCreateId("spending_items", reasonTitle);

    await db.runAsync(
      `INSERT INTO spendings (amount, item_id, importance, transaction_date)
       VALUES (?, ?, ?, ?)`,
      [amount, reasonId, importance, transactionDate]
    );
  }
}
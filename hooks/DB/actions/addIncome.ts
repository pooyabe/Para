import { getDbConnection } from "../helpers";
import { addLoanPayment, getLoanById } from "..";

/**
 * دریافت ID از جدول خاص؛ در صورت نبود، درج و برگشت ID
 */
async function getOrCreateId(
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

type AddIncomeInput = {
  amount: number;
  reasonTitle: string;
  destinationTitle: string;
  transactionDate: string; // ISO string
};

export async function addIncome({
  amount,
  reasonTitle,
  destinationTitle,
  transactionDate,
}: AddIncomeInput): Promise<void> {
  const db = await getDbConnection();

  // Check if reasonTitle is a loan ID (numeric string)
  const loanId = parseInt(reasonTitle, 10);
  const isLoanReceipt = !isNaN(loanId);

  if (isLoanReceipt) {
    // This is a loan receipt - verify the loan exists and is receivable
    const loan = await getLoanById(loanId);
    if (loan && loan.type === "receivable") {
      // Add loan receipt (payment received)
      await addLoanPayment({
        loanId,
        amount,
        paymentDate: transactionDate,
        type: "receipt",
      });
    }
    // Still record the income for tracking
    const reasonId = await getOrCreateId("income_reasons", `دریافت وام: ${loan?.source || "نامشخص"}`);
    const destinationId = await getOrCreateId(
      "income_destinations",
      destinationTitle
    );

    await db.runAsync(
      `INSERT INTO incomes (amount, reason_id, destination_id, transaction_date)
       VALUES (?, ?, ?, ?)`,
      [amount, reasonId, destinationId, transactionDate]
    );
  } else {
    // Regular income
    const reasonId = await getOrCreateId("income_reasons", reasonTitle);
    const destinationId = await getOrCreateId(
      "income_destinations",
      destinationTitle
    );

    await db.runAsync(
      `INSERT INTO incomes (amount, reason_id, destination_id, transaction_date)
       VALUES (?, ?, ?, ?)`,
      [amount, reasonId, destinationId, transactionDate]
    );
  }
}
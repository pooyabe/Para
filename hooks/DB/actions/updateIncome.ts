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

    return true;
  } catch (error) {
    console.error("Error updating income:", error);
    return false;
  }
}
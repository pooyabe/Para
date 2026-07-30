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

    const reasonId = await getOrCreateId("spending_items", reasonTitle);

    await db.runAsync(
      `UPDATE spendings
       SET amount = ?, item_id = ?, importance = ?, transaction_date = ?
       WHERE id = ?`,
      [amount, reasonId, importance, transactionDate, id]
    );

    return true;
  } catch (error) {
    console.error("Error updating spending:", error);
    return false;
  }
}
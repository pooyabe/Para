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

  const reasonId = await getOrCreateId("spending_items", reasonTitle);

  await db.runAsync(
    `INSERT INTO spendings (amount, item_id, importance, transaction_date)
     VALUES (?, ?, ?, ?)`,
    [amount, reasonId, importance, transactionDate]
  );
}

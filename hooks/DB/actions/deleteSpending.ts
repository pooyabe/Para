import { getDbConnection } from "../helpers";

export const deleteSpending = async (spendingId: number): Promise<boolean> => {
  try {
    const db = await getDbConnection();
    await db.runAsync("DELETE FROM spendings WHERE id = ?", [spendingId]);
    return true;
  } catch (error) {
    console.error("Error deleting spending:", error);
    return false;
  }
};

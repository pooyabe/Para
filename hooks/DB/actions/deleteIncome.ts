import { getDbConnection } from "../helpers";

export const deleteIncome = async (incomeId: number): Promise<boolean> => {
  try {
    const db = await getDbConnection();
    await db.runAsync("DELETE FROM incomes WHERE id = ?", [incomeId]);
    return true;
  } catch (error) {
    console.error("Error deleting income:", error);
    return false;
  }
};

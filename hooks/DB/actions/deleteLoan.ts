import { getDbConnection } from "../helpers";

export const deleteLoan = async (loanId: number): Promise<boolean> => {
  try {
    const db = await getDbConnection();
    await db.runAsync("DELETE FROM loans WHERE id = ?", [loanId]);
    return true;
  } catch (error) {
    console.error("Error deleting loan:", error);
    return false;
  }
};
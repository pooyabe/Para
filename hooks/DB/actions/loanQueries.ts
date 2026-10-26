import { getDbConnection } from "../helpers";
import { addLoanPayment } from "./addLoanPayment";
import type { Loan } from "./getLoans";

/** Get loan by id - static query module (no circular deps) */
export async function getLoanById(id: number): Promise<Loan | null> {
  const db = await getDbConnection();

  const result = await db.getFirstAsync<Loan>(
    `SELECT * FROM loans WHERE id = ?`,
    [id]
  );

  return result || null;
}

export { addLoanPayment };

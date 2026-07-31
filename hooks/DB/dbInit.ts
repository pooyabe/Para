// hooks/DB/dbInit.ts
import { getDbConnection } from "./helpers";
import { incomeTableSQL } from "./schemas/income";
import { incomeDestinationsTableSQL } from "./schemas/income_destinations";
import { incomeReasonsTableSQL } from "./schemas/income_reasons";
import { spendingTableSQL } from "./schemas/spending";
import { spendingItemsTableSQL } from "./schemas/spending_items";
import { loansTableSQL } from "./schemas/loans";
import { loanPaymentsTableSQL } from "./schemas/loan_payments";

export const initializeDatabase = async () => {
  try {
    const db = await getDbConnection();

    console.log("[DB] Initializing tables...");

    await db.execAsync(`
      PRAGMA journal_mode = WAL;

      ${incomeReasonsTableSQL}
      ${incomeDestinationsTableSQL}
      ${spendingItemsTableSQL}
      ${incomeTableSQL}
      ${spendingTableSQL}
      ${loansTableSQL}
      ${loanPaymentsTableSQL}
    `);

    console.log("[DB] ✅ All tables are ready.");
  } catch (error) {
    console.error("[DB] ❌ Initialization error:", error);
  }
};

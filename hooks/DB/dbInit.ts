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

    // Migration: Add loan_id column to existing tables if not present
    await runMigrations(db);

    console.log("[DB] ✅ All tables are ready.");
  } catch (error) {
    console.error("[DB] ❌ Initialization error:", error);
  }
};

async function runMigrations(db: any) {
  try {
    // Check if loan_id column exists in incomes table
    const incomeColumns = await db.getAllAsync(
      `PRAGMA table_info(incomes)`
    );
    const hasIncomeLoanId = incomeColumns.some((col: any) => col.name === "loan_id");

    if (!hasIncomeLoanId) {
      console.log("[DB] Adding loan_id column to incomes table...");
      await db.execAsync(`ALTER TABLE incomes ADD COLUMN loan_id INTEGER REFERENCES loans(id) ON DELETE SET NULL`);
      console.log("[DB] ✅ loan_id column added to incomes table");
    }

    // Check if loan_id column exists in spendings table
    const spendingColumns = await db.getAllAsync(
      `PRAGMA table_info(spendings)`
    );
    const hasSpendingLoanId = spendingColumns.some((col: any) => col.name === "loan_id");

    if (!hasSpendingLoanId) {
      console.log("[DB] Adding loan_id column to spendings table...");
      await db.execAsync(`ALTER TABLE spendings ADD COLUMN loan_id INTEGER REFERENCES loans(id) ON DELETE SET NULL`);
      console.log("[DB] ✅ loan_id column added to spendings table");
    }
  } catch (error) {
    console.error("[DB] ❌ Migration error:", error);
  }
}

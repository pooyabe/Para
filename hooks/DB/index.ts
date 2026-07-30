// hooks/DB/index.ts

// Initialization and exports for the database module
export { initializeDatabase } from "./dbInit";
export { getDbConnection } from "./helpers";

// Actions for managing incomes
export * from "./actions/addIncome";
export * from "./actions/getIncomeOptions";

// Actions for managing spending
export * from "./actions/addSpending";
export * from "./actions/deleteSpending";
export * from "./actions/getSpendingOptions";
export * from "./actions/updateSpending";

// Actions for managing income
export * from "./actions/addIncome";
export * from "./actions/getIncomeOptions";
export * from "./actions/updateIncome";

// Delete actions
export * from "./actions/deleteIncome";

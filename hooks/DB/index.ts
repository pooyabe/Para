// hooks/DB/index.ts

// Initialization and exports for the database module
export { initializeDatabase } from "./dbInit";
export { getDbConnection } from "./helpers";

// Actions for managing incomes + spending (single block)
export * from "./actions/addIncome";
export * from "./actions/getIncomeOptions";
export * from "./actions/addSpending";
export * from "./actions/deleteSpending";
export * from "./actions/getSpendingOptions";
export * from "./actions/updateSpending";
export * from "./actions/updateIncome";

// Delete actions
export * from "./actions/deleteIncome";

// Loan actions
export * from "./actions/addLoan";
export * from "./actions/getLoans";
export * from "./actions/updateLoan";
export * from "./actions/deleteLoan";
export * from "./actions/addLoanPayment";
export * from "./actions/getLoanPayments";
export * from "./actions/getLoanOptions";
export * from "./actions/getSettledLoans";

// App settings actions (theme, preferences, ...)
export * from "./actions/getSetting";
export * from "./actions/setSetting";
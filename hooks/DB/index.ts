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
export * from "./actions/deleteSpending";

// Loan actions
export * from "./actions/addLoan";
export * from "./actions/getLoans";
export * from "./actions/updateLoan";
export * from "./actions/deleteLoan";
export * from "./actions/addLoanPayment";
export * from "./actions/getLoanPayments";
export * from "./actions/getLoanOptions";
export * from "./actions/getSettledLoans";
export { getLoanById } from "./actions/getLoans";
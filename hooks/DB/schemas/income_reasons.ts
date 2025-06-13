export const incomeReasonsTableSQL = `
  CREATE TABLE IF NOT EXISTS income_reasons (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL UNIQUE
  );
`;

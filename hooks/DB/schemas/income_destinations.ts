export const incomeDestinationsTableSQL = `
  CREATE TABLE IF NOT EXISTS income_destinations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL UNIQUE
  );
`;

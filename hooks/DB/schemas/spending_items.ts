export const spendingItemsTableSQL = `
  CREATE TABLE IF NOT EXISTS spending_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL UNIQUE
  );
`;

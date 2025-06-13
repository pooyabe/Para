export const spendingTableSQL = `
  CREATE TABLE IF NOT EXISTS spendings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    amount INTEGER NOT NULL,
    item_id INTEGER,
    importance INTEGER CHECK(importance IN (0, 1, 2)),
    transaction_date TEXT NOT NULL,
    create_date TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (item_id) REFERENCES spending_items(id)
  );
`;

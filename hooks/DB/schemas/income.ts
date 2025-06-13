export const incomeTableSQL = `
  CREATE TABLE IF NOT EXISTS incomes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    amount INTEGER NOT NULL,
    reason_id INTEGER,
    destination_id INTEGER,
    transaction_date TEXT NOT NULL,
    create_date TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (reason_id) REFERENCES income_reasons(id),
    FOREIGN KEY (destination_id) REFERENCES income_destinations(id)
  );
`;

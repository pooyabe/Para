export const loansTableSQL = `
  CREATE TABLE IF NOT EXISTS loans (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT NOT NULL CHECK(type IN ('receivable', 'payable')),
    amount INTEGER NOT NULL,
    paid_amount INTEGER DEFAULT 0,
    source TEXT NOT NULL,
    description TEXT,
    start_date TEXT NOT NULL,
    end_date TEXT NOT NULL,
    is_settled INTEGER DEFAULT 0 CHECK(is_settled IN (0, 1)),
    create_date TEXT DEFAULT CURRENT_TIMESTAMP
  );
`;
import * as SQLite from "expo-sqlite";

export const dbInit = async () => {
  const db = await SQLite.openDatabaseAsync("para.db");

  await db.execAsync(`
  PRAGMA journal_mode = WAL;
  CREATE TABLE IF NOT EXISTS test (id INTEGER PRIMARY KEY NOT NULL, value TEXT NOT NULL, intValue INTEGER);
  INSERT INTO test (value, intValue) VALUES ('test1', 123);
  INSERT INTO test (value, intValue) VALUES ('test2', 456);
  INSERT INTO test (value, intValue) VALUES ('test3', 789);
  `);

  // `runAsync()` is useful when you want to execute some write operations.
  const result = await db.runAsync(
    "INSERT INTO test (value, intValue) VALUES (?, ?)",
    "aaa",
    100
  );
  console.log(result.lastInsertRowId, result.changes);
};

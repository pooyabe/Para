import * as SQLite from "expo-sqlite";

export const dbInit = async () => {
  const db = await SQLite.openDatabaseAsync("para.db");

  // `getAllAsync()` is useful when you want to get all results as an array of objects.
  const allRows = await db.getAllAsync("SELECT * FROM test");
  for (const row of allRows) {
    console.log(row.id, row.value, row.intValue);
  }
};

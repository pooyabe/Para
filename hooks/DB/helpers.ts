// hooks/DB/helpers.ts
import * as SQLite from "expo-sqlite";

export const getDbConnection = async () => {
  return await SQLite.openDatabaseAsync("para.db");
};

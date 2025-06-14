import { getDbConnection } from "../helpers";

type OptionItem = {
  label: string;
  value: string;
};

export async function getIncomeReasons(): Promise<OptionItem[]> {
  const db = await getDbConnection();

  const rows = await db.getAllAsync<{ title: string }>(
    `SELECT id, title FROM income_reasons ORDER BY title ASC`
  );

  return rows.map((row) => ({
    label: row.title,
    value: row.title,
  }));
}

export async function getIncomeDestinations(): Promise<OptionItem[]> {
  const db = await getDbConnection();

  const rows = await db.getAllAsync<{ title: string }>(
    `SELECT id, title FROM income_destinations ORDER BY title ASC`
  );

  return rows.map((row) => ({
    label: row.title,
    value: row.title,
  }));
}

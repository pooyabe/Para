import { getDbConnection } from "../helpers";

type OptionItem = {
  label: string;
  value: number;
};

export async function getSpendingOptions(): Promise<OptionItem[]> {
  const db = await getDbConnection();

  const rows = await db.getAllAsync<{ id: number; title: string }>(
    `SELECT id, title FROM spending_items ORDER BY title ASC`
  );

  return rows.map((row) => ({
    label: row.title,
    value: row.title,
  }));
}
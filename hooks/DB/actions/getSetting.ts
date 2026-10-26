// hooks/DB/actions/getSetting.ts
import { getDbConnection } from "../helpers";
import { settingsTableSQL } from "../schemas/settings";

/**
 * Reads a saved app setting (e.g. the selected theme).
 * Returns null when the setting was never saved.
 */
export const getSetting = async (key: string): Promise<string | null> => {
  try {
    const db = await getDbConnection();
    await db.execAsync(settingsTableSQL);

    const row = await db.getFirstAsync<{ value: string }>(
      "SELECT value FROM app_settings WHERE key = ?",
      key
    );

    return row?.value ?? null;
  } catch (error) {
    console.error("[DB] ❌ getSetting error:", error);
    return null;
  }
};

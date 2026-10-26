// hooks/DB/actions/setSetting.ts
import { getDbConnection } from "../helpers";
import { settingsTableSQL } from "../schemas/settings";

/**
 * Saves (or updates) an app setting, like the selected theme.
 */
export const setSetting = async (key: string, value: string): Promise<boolean> => {
  try {
    const db = await getDbConnection();
    await db.execAsync(settingsTableSQL);

    await db.runAsync(
      `INSERT INTO app_settings (key, value) VALUES (?, ?)
       ON CONFLICT(key) DO UPDATE SET value = excluded.value`,
      key,
      value
    );

    return true;
  } catch (error) {
    console.error("[DB] ❌ setSetting error:", error);
    return false;
  }
};

import * as DocumentPicker from "expo-document-picker";
import { Directory, Paths } from "expo-file-system";
import { readAsStringAsync, writeAsStringAsync } from "expo-file-system/legacy";
import { useCallback, useState } from "react";
import { Platform } from "react-native";
import { toast } from "sonner-native";

import { bumpDataRevision } from "@/hooks/BackEnd/useDataRevision";
import { getDbConnection } from "@/hooks/DB";

/**
 * The tables that hold the user's data.
 * The order matters: parents come first so a restore never breaks a foreign key.
 */
export const BACKUP_TABLES = [
  "income_reasons",
  "income_destinations",
  "spending_items",
  "loans",
  "incomes",
  "spendings",
  "loan_payments",
] as const;

type BackupTable = (typeof BACKUP_TABLES)[number];

const BACKUP_FORMAT_VERSION = 1;

export type BackupSummary = {
  tables: number;
  rows: number;
};

type ParsedTable = {
  name: BackupTable;
  columns: string[];
  rows: string[][];
};

type DbConnection = Awaited<ReturnType<typeof getDbConnection>>;

const isBackupTable = (name: string): name is BackupTable =>
  (BACKUP_TABLES as readonly string[]).includes(name);

/** The real column names of a table, taken from the database itself. */
const getTableColumns = async (
  db: DbConnection,
  table: BackupTable,
): Promise<string[]> => {
  const columns = await db.getAllAsync<{ name: string }>(
    `PRAGMA table_info(${table})`,
  );

  return columns.map((column) => column.name);
};

/**
 * CSV escaping: values that contain a separator, a quote, a line break or
 * leading/trailing spaces are wrapped in quotes. NULL becomes an empty field.
 */
const escapeCsvField = (value: unknown): string => {
  if (value === null || value === undefined) return "";

  const text = String(value);

  return /[",\n\r]|^\s|\s$/.test(text)
    ? `"${text.replace(/"/g, '""')}"`
    : text;
};

/**
 * A small CSV reader that understands quoted fields, escaped quotes and
 * line breaks inside a field. Comment/marker lines come back as single-field
 * rows, which is what `parseBackupCsv` expects.
 */
const parseCsvRows = (text: string): string[][] => {
  const rows: string[][] = [];

  let row: string[] = [];
  let field = "";
  let inQuotes = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];

    if (inQuotes) {
      if (char === '"') {
        if (text[index + 1] === '"') {
          field += '"';
          index += 1;
        } else {
          inQuotes = false;
        }
      } else {
        field += char;
      }
      continue;
    }

    if (char === '"') {
      inQuotes = true;
    } else if (char === ",") {
      row.push(field);
      field = "";
    } else if (char === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else if (char !== "\r") {
      field += char;
    }
  }

  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  // Excel adds a BOM when a file is saved again; it would break the first header.
  if (rows[0]?.[0]) {
    rows[0][0] = rows[0][0].replace(/^\uFEFF/, "");
  }

  return rows;
};

/**
 * Builds the backup file: one CSV with a `#table:<name>` marker before each
 * table, followed by that table's header row and its records.
 */
export async function buildBackupCsv(): Promise<{
  csv: string;
  summary: BackupSummary;
}> {
  const db = await getDbConnection();

  const lines: string[] = [
    `#para-backup:${BACKUP_FORMAT_VERSION}`,
    `#exported_at:${new Date().toISOString()}`,
  ];

  let rows = 0;

  for (const table of BACKUP_TABLES) {
    const columns = await getTableColumns(db, table);
    const records = await db.getAllAsync<Record<string, unknown>>(
      `SELECT * FROM ${table} ORDER BY id ASC`,
    );

    lines.push(`#table:${table}`);
    lines.push(columns.map(escapeCsvField).join(","));

    for (const record of records) {
      lines.push(columns.map((column) => escapeCsvField(record[column])).join(","));
      rows += 1;
    }
  }

  return {
    csv: `${lines.join("\r\n")}\r\n`,
    summary: { tables: BACKUP_TABLES.length, rows },
  };
}

/**
 * Reads a backup file back into tables. Throws when the file has no known
 * table, so the caller can tell the user the file is not a valid backup.
 */
export function parseBackupCsv(text: string): ParsedTable[] {
  const rows = parseCsvRows(text);
  const tables: ParsedTable[] = [];

  let current: ParsedTable | null = null;
  let expectingHeader = false;

  for (const row of rows) {
    // Blank line
    if (row.length === 1 && row[0].trim() === "") continue;

    if (row.length === 1 && row[0].startsWith("#table:")) {
      const name = row[0].slice("#table:".length).trim();

      if (!isBackupTable(name)) {
        throw new Error(`Unknown table in backup file: ${name}`);
      }

      current = { name, columns: [], rows: [] };
      tables.push(current);
      expectingHeader = true;
      continue;
    }

    // Other comments/metadata lines are skipped.
    if (row.length === 1 && row[0].startsWith("#")) continue;

    if (!current) continue;

    if (expectingHeader) {
      current.columns = row.map((column) => column.trim());
      expectingHeader = false;
      continue;
    }

    current.rows.push(row);
  }

  if (tables.length === 0) {
    throw new Error("The file does not contain any Para backup table.");
  }

  return tables;
}

/** Deletes every record of every user table (children first). */
const deleteAllRecords = async (db: DbConnection) => {
  for (const table of [...BACKUP_TABLES].reverse()) {
    await db.runAsync(`DELETE FROM ${table}`);
  }
};

/**
 * Replaces the current data with the content of a backup file.
 * Everything happens in one transaction, so a broken file leaves the data intact.
 */
export async function restoreBackupText(csv: string): Promise<BackupSummary> {
  const tables = parseBackupCsv(csv);
  const db = await getDbConnection();

  let rows = 0;

  await db.withTransactionAsync(async () => {
    await deleteAllRecords(db);

    for (const table of tables) {
      const knownColumns = await getTableColumns(db, table.name);

      // Only columns that really exist are written, so an edited backup
      // cannot inject SQL through its header row.
      const usableColumns = table.columns
        .map((column, index) => ({ column, index }))
        .filter(({ column }) => knownColumns.includes(column));

      if (usableColumns.length === 0) continue;

      const statement = `INSERT INTO ${table.name} (${usableColumns
        .map(({ column }) => column)
        .join(", ")}) VALUES (${usableColumns.map(() => "?").join(", ")})`;

      for (const row of table.rows) {
        if (!row.some((value) => value !== "")) continue;

        await db.runAsync(
          statement,
          usableColumns.map(({ index }) => {
            const value = row[index];
            return value === undefined || value === "" ? null : value;
          }),
        );

        rows += 1;
      }
    }
  });

  return { tables: tables.length, rows };
}

/** Removes all transactions, categories and loans. */
export async function wipeAllData(): Promise<void> {
  const db = await getDbConnection();

  await db.withTransactionAsync(async () => {
    await deleteAllRecords(db);
  });
}

const backupFileName = () => {
  const now = new Date();
  const pad = (value: number) => String(value).padStart(2, "0");

  return `para-backup-${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(
    now.getDate(),
  )}-${pad(now.getHours())}${pad(now.getMinutes())}.csv`;
};

/** The system picker reports a cancel as an error; that is not a failure. */
const isPickerCancel = (error: unknown) =>
  /cancel/i.test(error instanceof Error ? error.message : String(error));

/**
 * Export, import and wipe, with the UI state that goes with them.
 */
export function useDataBackup() {
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [isWiping, setIsWiping] = useState(false);

  /**
   * Asks the user for a folder (Android) and writes the CSV there.
   * Picking the folder is also what grants the app write access to it.
   */
  const exportData = useCallback(async () => {
    setIsExporting(true);

    try {
      const { csv, summary } = await buildBackupCsv();

      if (summary.rows === 0) {
        toast.warning("داده‌ای برای خروجی گرفتن وجود نداره.");
        return;
      }

      const fileName = backupFileName();

      let savedName = fileName;

      if (Platform.OS === "android") {
        const directory = await Directory.pickDirectoryAsync();
        const file = directory.createFile(fileName, "text/csv");

        file.write(csv);

        savedName = file.name;
      } else {
        // No folder picker on iOS: write next to the app's own data.
        await writeAsStringAsync(
          Paths.join(Paths.document.uri, fileName),
          csv
        );
      }

      toast.success(`پشتیبان در فایل «${savedName}» ذخیره شد.`);
    } catch (error) {
      if (isPickerCancel(error)) return;

      console.error("[Backup] ❌ export error:", error);
      toast.error("ذخیره فایل پشتیبان انجام نشد.");
    } finally {
      setIsExporting(false);
    }
  }, []);

  /** Lets the user pick a backup file and replaces the current data with it. */
  const importData = useCallback(async () => {
    setIsImporting(true);

    try {
      const picked = await DocumentPicker.getDocumentAsync({
        type: [
          "text/csv",
          "text/comma-separated-values",
          "text/plain",
          "application/csv",
          "application/vnd.ms-excel",
          "application/octet-stream",
        ],
        copyToCacheDirectory: true,
      });

      if (picked.canceled) return;

      const asset = picked.assets?.[0];
      if (!asset) return;

      // The picker copies the file into the app's own cache, so it always
      // lands on a readable file:// path. `readAsStringAsync` resolves the
      // permission through the file-system module, which works for every
      // uri the picker can return.
      const csv = await readAsStringAsync(asset.uri);
      const summary = await restoreBackupText(csv);

      bumpDataRevision();

      toast.success(`${summary.rows} رکورد از فایل پشتیبان بازگردانی شد.`);
    } catch (error) {
      console.error("[Backup] ❌ import error:", error);
      toast.error("فایل انتخاب‌شده یک پشتیبان معتبر نیست.");
    } finally {
      setIsImporting(false);
    }
  }, []);

  /** Deletes every record of the user's data. */
  const wipeData = useCallback(async () => {
    setIsWiping(true);

    try {
      await wipeAllData();

      bumpDataRevision();

      toast.success("همه داده‌ها پاک شد.");
    } catch (error) {
      console.error("[Backup] ❌ wipe error:", error);
      toast.error("پاک کردن داده‌ها انجام نشد.");
    } finally {
      setIsWiping(false);
    }
  }, []);

  return {
    exportData,
    importData,
    wipeData,
    isExporting,
    isImporting,
    isWiping,
    isBusy: isExporting || isImporting || isWiping,
  };
}

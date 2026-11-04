import { getDbConnection } from "../helpers";

export type LoanReminderMode = "once" | "monthly" | "weekly";

export interface LoanReminder {
  id: number;
  loan_id: number;
  mode: LoanReminderMode;
  /** تاریخ میلادی YYYY-MM-DD، فقط برای حالت یک‌بار */
  once_date: string | null;
  /** روز ماه شمسی ۱ تا ۳۱، فقط برای حالت ماهانه */
  day_of_month: number | null;
  /** روز هفته ۱ تا ۷ با ۱ = یکشنبه، فقط برای حالت هفتگی */
  day_of_week: number | null;
  /** آرایه JSON شناسه اعلان‌های زمان‌بندی‌شده در سیستم‌عامل */
  notification_ids: string;
  create_date: string;
}

export interface LoanReminderInput {
  mode: LoanReminderMode;
  onceDate?: string | null;
  dayOfMonth?: number | null;
  dayOfWeek?: number | null;
  notificationIds?: string[];
}

/** یادآور همراه با اطلاعات موردی که به آن تعلق دارد (برای ساخت متن اعلان). */
export interface LoanReminderWithLoan extends LoanReminder {
  loan_source: string;
  loan_type: "receivable" | "payable";
  loan_amount: number;
  loan_paid_amount: number;
}

/**
 * شناسه‌های اعلان ذخیره‌شده در یک ردیف را می‌خواند.
 * مقدار خراب یا قدیمی نباید باعث از کار افتادن فهرست یادآورها شود.
 */
export function parseLoanReminderNotificationIds(
  raw: string | null | undefined,
): string[] {
  if (!raw) return [];

  try {
    const parsed: unknown = JSON.parse(raw);

    return Array.isArray(parsed)
      ? parsed.filter((id): id is string => typeof id === "string")
      : [];
  } catch {
    return [];
  }
}

export async function getLoanReminders(loanId: number): Promise<LoanReminder[]> {
  const db = await getDbConnection();

  return db.getAllAsync<LoanReminder>(
    `SELECT * FROM loan_reminders WHERE loan_id = ? ORDER BY id ASC`,
    [loanId],
  );
}

/** تعداد یادآورهای هر مورد، برای نشان دادن روی کارت بده‌بستون. */
export async function getLoanReminderCounts(): Promise<Record<number, number>> {
  const db = await getDbConnection();

  const rows = await db.getAllAsync<{ loan_id: number; total: number }>(
    `SELECT loan_id, COUNT(*) AS total FROM loan_reminders GROUP BY loan_id`,
  );

  const counts: Record<number, number> = {};

  for (const row of rows) {
    counts[row.loan_id] = row.total;
  }

  return counts;
}

/** همه یادآورها همراه با اطلاعات مورد مربوطه، برای بازسازی زمان‌بندی‌ها. */
export async function getLoanRemindersWithLoan(): Promise<
  LoanReminderWithLoan[]
> {
  const db = await getDbConnection();

  return db.getAllAsync<LoanReminderWithLoan>(`
    SELECT
      r.*,
      l.source AS loan_source,
      l.type AS loan_type,
      l.amount AS loan_amount,
      COALESCE(l.paid_amount, 0) AS loan_paid_amount
    FROM loan_reminders r
    INNER JOIN loans l ON l.id = r.loan_id
    ORDER BY r.id ASC
  `);
}

export async function addLoanReminder(
  loanId: number,
  input: LoanReminderInput,
): Promise<number> {
  const db = await getDbConnection();

  const result = await db.runAsync(
    `INSERT INTO loan_reminders (loan_id, mode, once_date, day_of_month, day_of_week, notification_ids)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      loanId,
      input.mode,
      input.onceDate ?? null,
      input.dayOfMonth ?? null,
      input.dayOfWeek ?? null,
      JSON.stringify(input.notificationIds ?? []),
    ],
  );

  return result.lastInsertRowId;
}

export async function updateLoanReminder(
  reminderId: number,
  input: LoanReminderInput,
): Promise<void> {
  const db = await getDbConnection();

  await db.runAsync(
    `UPDATE loan_reminders
     SET mode = ?, once_date = ?, day_of_month = ?, day_of_week = ?, notification_ids = ?
     WHERE id = ?`,
    [
      input.mode,
      input.onceDate ?? null,
      input.dayOfMonth ?? null,
      input.dayOfWeek ?? null,
      JSON.stringify(input.notificationIds ?? []),
      reminderId,
    ],
  );
}

export async function setLoanReminderNotificationIds(
  reminderId: number,
  notificationIds: string[],
): Promise<void> {
  const db = await getDbConnection();

  await db.runAsync(
    `UPDATE loan_reminders SET notification_ids = ? WHERE id = ?`,
    [JSON.stringify(notificationIds), reminderId],
  );
}

export async function deleteLoanReminder(reminderId: number): Promise<void> {
  const db = await getDbConnection();

  await db.runAsync(`DELETE FROM loan_reminders WHERE id = ?`, [reminderId]);
}

/**
 * همه شناسه‌های اعلان زمان‌بندی‌شده.
 * پیش از پاک کردن داده‌ها خوانده می‌شود تا اعلان‌های باقی‌مانده هم لغو شوند.
 */
export async function getAllLoanReminderNotificationIds(): Promise<string[]> {
  const db = await getDbConnection();

  const rows = await db.getAllAsync<{ notification_ids: string }>(
    `SELECT notification_ids FROM loan_reminders`,
  );

  return rows.flatMap((row) =>
    parseLoanReminderNotificationIds(row.notification_ids),
  );
}

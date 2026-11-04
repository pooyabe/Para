/**
 * یادآورهای اعلان هر مورد بده‌بستون.
 *
 * - mode: "once" یک‌بار، "monthly" هر ماه (روز ماه شمسی)، "weekly" هر هفته.
 * - once_date: تاریخ میلادی YYYY-MM-DD (فقط برای حالت یک‌بار).
 * - day_of_month: روز ماه شمسی ۱ تا ۳۱ (فقط برای حالت ماهانه).
 * - day_of_week: روز هفته ۱ تا ۷ با ۱ = یکشنبه (قرارداد Android/expo-notifications).
 * - notification_ids: آرایه JSON شناسه اعلان‌هایی که در سیستم‌عامل زمان‌بندی شده‌اند.
 */
export const loanRemindersTableSQL = `
  CREATE TABLE IF NOT EXISTS loan_reminders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    loan_id INTEGER NOT NULL,
    mode TEXT NOT NULL CHECK(mode IN ('once', 'monthly', 'weekly')),
    once_date TEXT,
    day_of_month INTEGER,
    day_of_week INTEGER,
    notification_ids TEXT NOT NULL DEFAULT '[]',
    create_date TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (loan_id) REFERENCES loans(id) ON DELETE CASCADE
  );

  CREATE INDEX IF NOT EXISTS idx_loan_reminders_loan_id ON loan_reminders(loan_id);
`;

import {
  getLoanRemindersWithLoan,
  parseLoanReminderNotificationIds,
  setLoanReminderNotificationIds,
  type LoanReminderWithLoan,
} from "@/hooks/DB";
import {
  buildLoanReminderTriggers,
  cancelLoanReminderNotifications,
  isLoanReminderNotificationsSupported,
  scheduleLoanReminderNotifications,
  type LoanReminderNotificationTarget,
} from "./reminderNotifications";

const toNotificationTarget = (
  row: LoanReminderWithLoan,
): LoanReminderNotificationTarget => ({
  id: row.loan_id,
  source: row.loan_source,
  type: row.loan_type,
  amount: row.loan_amount,
  paid_amount: row.loan_paid_amount,
});

/**
 * پنجره زمان‌بندی یادآورهای ماهانه را جلو می‌برد.
 *
 * یادآور ماهانه با اعلان‌های تک‌زمانی برای چند ماه آینده ساخته می‌شود؛ هر بار
 * که برنامه باز شود، اگر ماه جدیدی وارد پنجره شده باشد دوباره زمان‌بندی می‌شود.
 * اگر پنجره فعلی کامل باشد کاری انجام نمی‌شود، تا اعلان‌ها بی‌دلیل بازنویسی نشوند.
 */
export async function refreshLoanReminderSchedules(): Promise<void> {
  if (!isLoanReminderNotificationsSupported()) return;

  let rows: LoanReminderWithLoan[];

  try {
    rows = await getLoanRemindersWithLoan();
  } catch (error) {
    console.warn("[LoanReminders] load failed:", error);
    return;
  }

  for (const row of rows) {
    if (row.mode !== "monthly") continue;

    try {
      const desiredIds = buildLoanReminderTriggers(row).map(
        (item) => item.identifier,
      );
      const currentIds = parseLoanReminderNotificationIds(row.notification_ids);

      const isUpToDate =
        desiredIds.length === currentIds.length &&
        desiredIds.every((identifier) => currentIds.includes(identifier));

      if (isUpToDate) continue;

      const scheduledIds = await scheduleLoanReminderNotifications(
        toNotificationTarget(row),
        row,
      );

      await setLoanReminderNotificationIds(row.id, scheduledIds);
      await cancelLoanReminderNotifications(
        currentIds.filter((identifier) => !scheduledIds.includes(identifier)),
      );
    } catch (error) {
      console.warn("[LoanReminders] refresh failed:", row.id, error);
    }
  }
}

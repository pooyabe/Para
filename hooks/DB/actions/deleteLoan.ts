import { getDbConnection } from "../helpers";
import { parseLoanReminderNotificationIds } from "./loanReminders";

export interface DeleteLoanResult {
  success: boolean;
  /** شناسه اعلان‌های یادآورهای حذف‌شده، برای لغو آن‌ها در سیستم‌عامل */
  notificationIds: string[];
}

/**
 * حذف یک مورد بده‌بستون همراه با یادآورهایش.
 *
 * هر دو حذف در یک تراکنش انجام می‌شوند تا یادآور بی‌صاحب باقی نماند.
 * شناسه اعلان‌ها برگردانده می‌شود چون لغو اعلان باید بیرون از تراکنش پایگاه
 * داده انجام شود.
 */
export const deleteLoan = async (
  loanId: number,
): Promise<DeleteLoanResult> => {
  let notificationIds: string[] = [];

  try {
    const db = await getDbConnection();

    await db.withTransactionAsync(async () => {
      const reminderRows = await db.getAllAsync<{
        notification_ids: string;
      }>(`SELECT notification_ids FROM loan_reminders WHERE loan_id = ?`, [
        loanId,
      ]);

      notificationIds = reminderRows.flatMap((row) =>
        parseLoanReminderNotificationIds(row.notification_ids),
      );

      await db.runAsync(`DELETE FROM loan_reminders WHERE loan_id = ?`, [
        loanId,
      ]);
      await db.runAsync("DELETE FROM loans WHERE id = ?", [loanId]);
    });

    return { success: true, notificationIds };
  } catch (error) {
    console.error("Error deleting loan:", error);
    return { success: false, notificationIds: [] };
  }
};

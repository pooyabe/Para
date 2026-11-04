import { useShamsiDate } from "@/hooks/BackEnd/useShamsiDate";
import {
  addLoanReminder,
  deleteLoanReminder,
  getLoanReminders,
  setLoanReminderNotificationIds,
  updateLoanReminder,
} from "@/hooks/DB";
import type { Loan } from "@/hooks/DB/actions/getLoans";
import type {
  LoanReminder,
  LoanReminderInput,
  LoanReminderMode,
} from "@/hooks/DB/actions/loanReminders";
import { parseLoanReminderNotificationIds } from "@/hooks/DB/actions/loanReminders";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner-native";
import {
  cancelLoanReminderNotifications,
  ensureLoanReminderPermission,
  isLoanReminderNotificationsSupported,
  scheduleLoanReminderNotifications,
} from "../loanReminders/reminderNotifications";
import {
  getJalaliToday,
  getOnceReminderDateTime,
  getTodayWeekday,
  toGregorianDateString,
} from "../loanReminders/reminderTime";

export type ReminderSaveResult =
  | "saved"
  | "invalid"
  | "permission"
  | "unsupported"
  | "error";

/**
 * وضعیت و عملیات صفحه یادآورهای یک مورد بده‌بستون.
 *
 * ترتیب کارها برای حفظ یکپارچگی: اول اعلان‌ها در سیستم‌عامل زمان‌بندی می‌شوند،
 * بعد ردیف پایگاه داده ثبت می‌شود و در پایان اعلان‌های قدیمی لغو می‌شوند.
 * اگر هر مرحله شکست بخورد، اثرهای مراحل قبلی برگردانده می‌شوند.
 */
export function useLoanReminders(loan: Loan | null) {
  const { toJalali } = useShamsiDate();

  const [reminders, setReminders] = useState<LoanReminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingReminder, setEditingReminder] = useState<LoanReminder | null>(
    null,
  );
  const [mode, setMode] = useState<LoanReminderMode>("monthly");
  const [dayOfMonth, setDayOfMonth] = useState(1);
  const [dayOfWeek, setDayOfWeek] = useState(7);
  const [onceJalaliDate, setOnceJalaliDate] = useState(getJalaliToday());

  const loadReminders = useCallback(async () => {
    if (!loan) {
      setReminders([]);
      setLoading(false);
      return;
    }

    try {
      setReminders(await getLoanReminders(loan.id));
    } catch (error) {
      console.error("[LoanReminders] ❌ load error:", error);
      toast.error("بارگذاری یادآورها انجام نشد.");
    } finally {
      setLoading(false);
    }
  }, [loan]);

  useEffect(() => {
    // مثل بقیه صفحه‌ها، بارگذاری اولیه در یک تابع async داخل افکت انجام می‌شود.
    const fetchReminders = async () => {
      await loadReminders();
    };

    fetchReminders();
  }, [loadReminders]);

  const openCreateForm = useCallback(() => {
    const today = getJalaliToday();

    setEditingReminder(null);
    setMode("monthly");
    setDayOfMonth(Number(today.split("/")[2]));
    setDayOfWeek(getTodayWeekday());
    setOnceJalaliDate(today);
    setIsFormOpen(true);
  }, []);

  const openEditForm = useCallback(
    (reminder: LoanReminder) => {
      setEditingReminder(reminder);
      setMode(reminder.mode);
      setDayOfMonth(reminder.day_of_month ?? 1);
      setDayOfWeek(reminder.day_of_week ?? 7);
      setOnceJalaliDate(
        reminder.once_date ? toJalali(reminder.once_date) : getJalaliToday(),
      );
      setIsFormOpen(true);
    },
    [toJalali],
  );

  const closeForm = useCallback(() => {
    setIsFormOpen(false);
    setEditingReminder(null);
  }, []);

  const saveReminder = useCallback(async (): Promise<ReminderSaveResult> => {
    if (!loan) return "error";

    if (!isLoanReminderNotificationsSupported()) {
      toast.error(
        "در این نسخه از برنامه امکان ثبت یادآور نیست؛ نسخه نصب‌شده اپ روی گوشی را اجرا کنید.",
      );
      return "unsupported";
    }

    if (saving) return "error";

    if (mode === "monthly" && (dayOfMonth < 1 || dayOfMonth > 31)) {
      toast.warning("روز ماه را انتخاب کنید.");
      return "invalid";
    }

    if (mode === "weekly" && (dayOfWeek < 1 || dayOfWeek > 7)) {
      toast.warning("روز هفته را انتخاب کنید.");
      return "invalid";
    }

    const onceDate =
      mode === "once" ? toGregorianDateString(onceJalaliDate) : null;

    if (
      mode === "once" &&
      (!onceDate || getOnceReminderDateTime(onceDate).getTime() <= Date.now())
    ) {
      toast.warning("زمان این یادآور گذشته است؛ روز دیگری انتخاب کنید.");
      return "invalid";
    }

    setSaving(true);

    try {
      if (!(await ensureLoanReminderPermission())) {
        toast.error("برای دریافت یادآور باید اعلان‌های پارا فعال باشند.");
        return "permission";
      }

      const target = {
        id: loan.id,
        source: loan.source,
        type: loan.type,
        amount: loan.amount,
        paid_amount: loan.paid_amount,
      };

      const input: LoanReminderInput = {
        mode,
        onceDate,
        dayOfMonth: mode === "monthly" ? dayOfMonth : null,
        dayOfWeek: mode === "weekly" ? dayOfWeek : null,
      };

      const schedule = {
        mode,
        once_date: onceDate,
        day_of_month: input.dayOfMonth ?? null,
        day_of_week: input.dayOfWeek ?? null,
      };

      if (editingReminder) {
        const previousIds = parseLoanReminderNotificationIds(
          editingReminder.notification_ids,
        );

        const newIds = await scheduleLoanReminderNotifications(target, {
          id: editingReminder.id,
          ...schedule,
        });

        try {
          await updateLoanReminder(editingReminder.id, {
            ...input,
            notificationIds: newIds,
          });
        } catch (error) {
          // زمان‌بندی قبلی برگردانده می‌شود تا اعلان‌ها با پایگاه داده هم‌خوان بمانند.
          await cancelLoanReminderNotifications(newIds);
          try {
            await scheduleLoanReminderNotifications(target, editingReminder);
          } catch (restoreError) {
            console.warn("[LoanReminders] restore failed:", restoreError);
          }
          throw error;
        }

        await cancelLoanReminderNotifications(
          previousIds.filter((identifier) => !newIds.includes(identifier)),
        );
      } else {
        // ردیف اول ثبت می‌شود تا شناسه یکتای اعلان‌های این یادآور مشخص باشد.
        const reminderId = await addLoanReminder(loan.id, input);
        let newIds: string[] = [];

        try {
          newIds = await scheduleLoanReminderNotifications(target, {
            id: reminderId,
            ...schedule,
          });
          await setLoanReminderNotificationIds(reminderId, newIds);
        } catch (error) {
          await cancelLoanReminderNotifications(newIds);
          await deleteLoanReminder(reminderId);
          throw error;
        }
      }

      await loadReminders();
      setIsFormOpen(false);
      setEditingReminder(null);
      toast.success(
        editingReminder ? "یادآور ویرایش شد." : "یادآور با موفقیت ثبت شد.",
      );

      return "saved";
    } catch (error) {
      console.error("[LoanReminders] ❌ save error:", error);
      toast.error("ثبت یادآور انجام نشد.");
      return "error";
    } finally {
      setSaving(false);
    }
  }, [
    loan,
    mode,
    dayOfMonth,
    dayOfWeek,
    onceJalaliDate,
    editingReminder,
    saving,
    loadReminders,
  ]);

  const removeReminder = useCallback(
    async (reminder: LoanReminder): Promise<boolean> => {
      setSaving(true);

      try {
        await cancelLoanReminderNotifications(
          parseLoanReminderNotificationIds(reminder.notification_ids),
        );
        await deleteLoanReminder(reminder.id);
        await loadReminders();
        toast.success("یادآور حذف شد.");
        return true;
      } catch (error) {
        console.error("[LoanReminders] ❌ delete error:", error);
        toast.error("حذف یادآور انجام نشد.");
        return false;
      } finally {
        setSaving(false);
      }
    },
    [loadReminders],
  );

  return {
    reminders,
    loading,
    saving,
    isFormOpen,
    editingReminder,
    mode,
    setMode,
    dayOfMonth,
    setDayOfMonth,
    dayOfWeek,
    setDayOfWeek,
    onceJalaliDate,
    setOnceJalaliDate,
    openCreateForm,
    openEditForm,
    closeForm,
    saveReminder,
    removeReminder,
  };
}

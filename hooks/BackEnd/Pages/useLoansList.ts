import { cancelLoanReminderNotifications } from "@/hooks/BackEnd/loanReminders/reminderNotifications";
import {
  deleteLoan,
  getLoanPayments,
  getLoanReminderCounts,
  getLoans,
  type LoanPayment,
} from "@/hooks/DB";
import type { Loan } from "@/hooks/DB/actions/getLoans";
import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner-native";

export type LoansViewMode = "all" | "active" | "settled";

/**
 * داده‌ها و عملیات صفحه فهرست بده‌بستون.
 *
 * تایید حذف با کاربر در خود صفحه گرفته می‌شود؛ این هوک فقط داده را می‌خواند،
 * حذف را انجام می‌دهد و وضعیت فهرست را هم‌خوان نگه می‌دارد.
 */
export function useLoansList() {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [reminderCounts, setReminderCounts] = useState<Record<number, number>>(
    {},
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<LoansViewMode>("active");

  // مودال پرداخت‌های یک مورد
  const [modalLoan, setModalLoan] = useState<Loan | null>(null);
  const [modalPayments, setModalPayments] = useState<LoanPayment[]>([]);
  const [modalLoading, setModalLoading] = useState<boolean>(false);

  const loadLoans = useCallback(async () => {
    setLoading(true);
    try {
      let loanList: Loan[];
      if (viewMode === "settled") {
        loanList = await getLoans(true);
        loanList = loanList.filter((l) => l.is_settled === 1);
      } else if (viewMode === "active") {
        loanList = await getLoans(false);
        loanList = loanList.filter(
          (l) => l.is_settled === 0 || l.is_settled === undefined,
        );
      } else {
        loanList = await getLoans(true);
        // Show all loans regardless of settlement status when viewMode is "all"
        // No filter applied - keep all loans (settled, active, and unsettled)
      }
      setLoans(loanList);
      setReminderCounts(await getLoanReminderCounts());
    } catch (error) {
      console.error("Error loading loans:", error);
    } finally {
      setLoading(false);
    }
  }, [viewMode]);

  useEffect(() => {
    // مثل بقیه صفحه‌ها، بارگذاری اولیه در یک تابع async داخل افکت انجام می‌شود.
    const fetchLoans = async () => {
      await loadLoans();
    };

    fetchLoans();
  }, [loadLoans]);

  // Refresh when screen gains focus
  useFocusEffect(
    useCallback(() => {
      loadLoans();
    }, [loadLoans]),
  );

  /**
   * حذف یک مورد بده‌بستون. یادآورهای مورد هم حذف و اعلان‌هایشان لغو می‌شود.
   * در صورت موفقیت `true` برمی‌گرداند.
   */
  const removeLoan = useCallback(async (id: number): Promise<boolean> => {
    try {
      const result = await deleteLoan(id);

      if (!result.success) {
        toast.error("حذف مورد انجام نشد.");
        return false;
      }

      // یادآورهای مورد حذف‌شده نباید بعداً اعلان بدهند.
      await cancelLoanReminderNotifications(result.notificationIds);

      setLoans((prev) => prev.filter((l) => l.id !== id));
      setReminderCounts((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
      toast.success("مورد با موفقیت حذف شد");
      return true;
    } catch (error) {
      console.error("Error deleting loan:", error);
      toast.error("حذف مورد انجام نشد.");
      return false;
    }
  }, []);

  const openPayments = useCallback(async (loan: Loan) => {
    setModalLoan(loan);
    setModalLoading(true);
    try {
      const payments = await getLoanPayments(loan.id);
      setModalPayments(payments);
    } catch (error) {
      console.error("Error loading payments:", error);
      toast.error("خطا در بارگذاری جزئیات پرداخت");
    } finally {
      setModalLoading(false);
    }
  }, []);

  const closePayments = useCallback(() => {
    setModalLoan(null);
    setModalPayments([]);
  }, []);

  return {
    loans,
    reminderCounts,
    loading,
    viewMode,
    setViewMode,
    modalLoan,
    modalPayments,
    modalLoading,
    loadLoans,
    removeLoan,
    openPayments,
    closePayments,
  };
}

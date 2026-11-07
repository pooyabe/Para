import { getSettledLoans, type SettledLoan } from "@/hooks/DB";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner-native";

/**
 * بارگذاری موارد تسویه‌شده همراه پرداخت‌هایشان.
 * باز و بسته کردن هر کارت، وضعیت نمایشی صفحه است و اینجا نگه داشته نمی‌شود.
 */
export function useSettledLoans() {
  const [settledLoans, setSettledLoans] = useState<SettledLoan[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const loadSettledLoans = useCallback(async () => {
    setLoading(true);
    try {
      setSettledLoans(await getSettledLoans());
    } catch (error) {
      console.error("Error loading settled loans:", error);
      toast.error("خطا در بارگذاری وام‌های تسویه شده");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const fetchSettledLoans = async () => {
      await loadSettledLoans();
    };

    fetchSettledLoans();
  }, [loadSettledLoans]);

  return { settledLoans, loading, loadSettledLoans };
}

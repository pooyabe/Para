import { useShamsiDate } from "@/hooks/BackEnd/useShamsiDate";
import { deleteIncome } from "@/hooks/DB/actions/deleteIncome";
import { deleteSpending } from "@/hooks/DB/actions/deleteSpending";
import {
  getTransactions,
  type Transaction,
} from "@/hooks/DB/reports/useTransactions";
import { useEffect, useState } from "react";
import type { NativeScrollEvent, NativeSyntheticEvent } from "react-native";
import { toast } from "sonner-native";

const PAGE_SIZE = 10;

/**
 * فهرست صفحه‌بندی‌شده تراکنش‌ها، فیلتر تاریخ و حذف تراکنش.
 *
 * وضعیت فقط داده‌ای است؛ نمایش اسپینر و پیام خالی بودن در خود صفحه انجام می‌شود.
 */
export function useTransactionsList() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [offset, setOffset] = useState<number>(0);
  const [selectedDate, setSelectedDate] = useState<string | undefined>(
    undefined,
  );

  const { toGregorian } = useShamsiDate();

  const loadTransactions = async (
    reset: boolean = false,
    dateFilter?: string,
  ) => {
    if (loading || (!hasMore && !reset)) return;

    setLoading(true);
    try {
      const newOffset = reset ? 0 : offset;
      const gregorianDate = dateFilter ? toGregorian(dateFilter) : undefined;
      const newTransactions = await getTransactions(
        PAGE_SIZE,
        newOffset,
        gregorianDate,
      );

      if (reset) {
        setTransactions(newTransactions);
        setOffset(PAGE_SIZE);
      } else {
        setTransactions((prev) => [...prev, ...newTransactions]);
        setOffset((prev) => prev + PAGE_SIZE);
      }

      if (newTransactions.length < PAGE_SIZE) {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error loading transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchTransactions = async () => {
      await loadTransactions(true, selectedDate);
    };

    fetchTransactions();
  }, [selectedDate]);

  /** فیلتر تاریخ را عوض می‌کند و فهرست را از ابتدا می‌خواند. */
  const selectDate = (date: string) => {
    setSelectedDate(date);
    setHasMore(true);
  };

  const refresh = () => loadTransactions(true, selectedDate);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const isCloseToBottom =
      layoutMeasurement.height + contentOffset.y >= contentSize.height - 50;

    if (isCloseToBottom && hasMore && !loading) {
      loadTransactions();
    }
  };

  /** یک تراکنش درآمد یا هزینه را حذف می‌کند و فهرست را به‌روز نگه می‌دارد. */
  const handleDeleteTransaction = async (type: string, id: number) => {
    try {
      const success =
        type === "income" ? await deleteIncome(id) : await deleteSpending(id);

      if (success) {
        // Remove the deleted transaction from the list
        setTransactions((prev) =>
          prev.filter((t) => !(t.type === type && t.id === id)),
        );

        toast.success("تراکنش با موفقیت حذف شد");
      }
    } catch (error) {
      console.error("Error deleting transaction:", error);
    }
  };

  return {
    transactions,
    loading,
    hasMore,
    selectedDate,
    selectDate,
    loadTransactions,
    refresh,
    handleScroll,
    handleDeleteTransaction,
  };
}

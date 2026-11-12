import { useDataRevision } from "@/hooks/BackEnd/useDataRevision";
import { useShamsiDate } from "@/hooks/BackEnd/useShamsiDate";
import { getCategoryItems } from "@/hooks/DB/actions/categories";
import { deleteIncome } from "@/hooks/DB/actions/deleteIncome";
import { deleteSpending } from "@/hooks/DB/actions/deleteSpending";
import {
  getTransactions,
  type Transaction,
  type TransactionCategoryFilter,
} from "@/hooks/DB/reports/useTransactions";
import { useEffect, useState } from "react";
import type { NativeScrollEvent, NativeSyntheticEvent } from "react-native";
import { toast } from "sonner-native";

const PAGE_SIZE = 10;

/** مقدار گزینه «نمایش همه» در انتخاب‌گر دسته؛ یعنی فیلتر دسته اعمال نشود. */
const ALL_CATEGORIES = "all";

export type CategoryOption = { label: string; value: string };

const ALL_CATEGORIES_OPTION: CategoryOption = {
  label: "همه تراکنش‌ها",
  value: ALL_CATEGORIES,
};

/**
 * گزینه‌های دسته به شکل «نوع:id» نگه داشته می‌شوند؛ شناسه دسته‌های هزینه و
 * دلیل‌های درآمد از دو جدول جدا می‌آید و نباید با هم اشتباه شود.
 */
function parseCategoryValue(
  value: string,
): TransactionCategoryFilter | undefined {
  if (value === ALL_CATEGORIES) return undefined;

  const [type, rawId] = value.split(":");
  const id = Number(rawId);

  if (!Number.isInteger(id) || id <= 0) return undefined;
  if (type === "spending") return { type: "spending", id };
  if (type === "income") return { type: "income", id };

  return undefined;
}

/** دسته‌های هزینه و دلیل‌های درآمد را برای انتخاب‌گر فیلتر می‌خواند. */
async function loadCategoryOptions(): Promise<CategoryOption[]> {
  const [spendingCategories, incomeReasons] = await Promise.all([
    getCategoryItems("spending"),
    getCategoryItems("incomeReason"),
  ]);

  return [
    ALL_CATEGORIES_OPTION,
    ...spendingCategories.map((item) => ({
      label: `هزینه: ${item.title}`,
      value: `spending:${item.id}`,
    })),
    ...incomeReasons.map((item) => ({
      label: `درآمد: ${item.title}`,
      value: `income:${item.id}`,
    })),
  ];
}

/**
 * فهرست صفحه‌بندی‌شده تراکنش‌ها، فیلتر تاریخ و دسته، و حذف تراکنش.
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
  const [selectedCategory, setSelectedCategory] = useState<string>(
    ALL_CATEGORIES,
  );
  const [categoryOptions, setCategoryOptions] = useState<CategoryOption[]>([
    ALL_CATEGORIES_OPTION,
  ]);

  const { toGregorian } = useShamsiDate();

  // تغییر نام یا حذف دسته‌ها از تنظیمات باید فهرست را تازه کند.
  const dataRevision = useDataRevision();

  const loadCategories = async () => {
    try {
      const options = await loadCategoryOptions();

      setCategoryOptions(options);
      // دسته‌ای که از تنظیمات حذف شده نباید فهرست را خالی نگه دارد.
      setSelectedCategory((previous) =>
        options.some((option) => option.value === previous)
          ? previous
          : ALL_CATEGORIES,
      );
    } catch (error) {
      console.error("Error loading transaction categories:", error);
    }
  };

  const loadTransactions = async (reset: boolean = false) => {
    if (loading || (!hasMore && !reset)) return;

    setLoading(true);
    try {
      const newOffset = reset ? 0 : offset;
      const gregorianDate = selectedDate ? toGregorian(selectedDate) : undefined;
      const newTransactions = await getTransactions(
        PAGE_SIZE,
        newOffset,
        gregorianDate,
        parseCategoryValue(selectedCategory),
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
      await loadTransactions(true);
    };

    fetchTransactions();
  }, [selectedDate, selectedCategory]);

  // تغییر نام یا حذف دسته‌ها از تنظیمات، فهرست دسته‌ها و نام تراکنش‌های این
  // فهرست را هم عوض می‌کند.
  useEffect(() => {
    const reloadCategories = async () => {
      await loadCategories();
    };

    reloadCategories();
  }, [dataRevision]);

  useEffect(() => {
    if (dataRevision === 0) return;

    const reloadTransactions = async () => {
      await loadTransactions(true);
    };

    reloadTransactions();
  }, [dataRevision]);

  /** فیلتر تاریخ را عوض می‌کند و فهرست را از ابتدا می‌خواند. */
  const selectDate = (date: string) => {
    setSelectedDate(date);
    setHasMore(true);
  };

  /** فیلتر دسته را عوض می‌کند و فهرست را از ابتدا می‌خواند. */
  const selectCategory = (category: string) => {
    setSelectedCategory(category);
    setHasMore(true);
  };

  const refresh = () => loadTransactions(true);

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
    categoryOptions,
    selectedCategory,
    selectCategory,
    loadTransactions,
    refresh,
    handleScroll,
    handleDeleteTransaction,
  };
}

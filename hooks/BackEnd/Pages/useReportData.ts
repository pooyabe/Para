import {
  getDefaultCustomRange,
  type CustomRange,
  type RangeType,
} from "@/hooks/BackEnd/useDateRange";
import { useDataRevision } from "@/hooks/BackEnd/useDataRevision";
import {
  getImportanceDistribution,
  type ImportanceData,
} from "@/hooks/DB/reports/useImportanceDistribution";
import { getIncomeDistribution } from "@/hooks/DB/reports/useIncomeDistribution";
import {
  getLoanReport,
  type LoanReportData,
} from "@/hooks/DB/reports/useLoanReport";
import { getMonthlyReport } from "@/hooks/DB/reports/useMonthlyReport";
import { getSpendingDistribution } from "@/hooks/DB/reports/useSpendingPercentage";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner-native";

/**
 * داده‌های صفحه گزارش: بازه انتخاب‌شده، تاریخ‌های بازه دلخواه و گزارش‌های
 * خوانده‌شده از پایگاه داده.
 *
 * رنگ‌های نمودار سهمی از بیرون داده می‌شود، چون بخشی از ظاهر صفحه است.
 */
export function useReportData(spendingPieColors: string[]) {
  const [showLoading, setShowLoading] = useState<boolean>(true);

  // This state sets which date period button is selected
  const [selectedRange, setSelectedRange] = useState<RangeType>("month");

  // This state holds the custom period (from / to) selected by the user
  const [customRange, setCustomRange] = useState<CustomRange | null>(null);

  // This state shows / hides the custom period date pickers
  const [showCustomDates, setShowCustomDates] = useState<boolean>(false);

  // Overal line chart data
  const [overalSpendingReport, setOveralSpendingReport] = useState<
    { value: number; label: string }[]
  >([]);
  const [overalIncomeReport, setOveralIncomeReport] = useState<
    { value: number; label: string }[]
  >([]);
  const [incomeDistribution, setIncomeDistribution] = useState<
    { value: number; text: string; color: string; amount: number }[]
  >([]);
  const [loanReport, setLoanReport] = useState<LoanReportData>({
    receivableTotal: 0,
    receivableOutstanding: 0,
    payableTotal: 0,
    payableOutstanding: 0,
    receivedInRange: 0,
    paidInRange: 0,
    loanCountInRange: 0,
  });

  // Spending items percentages
  const [percentageSpendingReport, setPercentageSpendingReport] = useState<
    any[]
  >([]);

  // Importance distribution data
  const [importanceData, setImportanceData] = useState<ImportanceData>({
    alkaaei: 0,
    borderline: 0,
    necessary: 0,
    total: 0,
  });

  // Restore / wipe in the settings page replaces the data this screen shows.
  const dataRevision = useDataRevision();

  // The latest selected range, so a data refresh keeps the current period.
  const latestSelection = useRef({ range: selectedRange, custom: customRange });

  useEffect(() => {
    latestSelection.current = { range: selectedRange, custom: customRange };
  }, [selectedRange, customRange]);

  const fetchData = useCallback(
    async (rangeKey: RangeType, theCustomRange?: CustomRange) => {
      // Show loading
      setShowLoading(true);

      // Get Overal Spending data from DB
      const osr = await getMonthlyReport("spendings", rangeKey, theCustomRange);
      setOveralSpendingReport(osr);
      const incomeReport = await getMonthlyReport(
        "incomes",
        rangeKey,
        theCustomRange,
        0,
      );
      setOveralIncomeReport(incomeReport);
      const incomeCategories = await getIncomeDistribution(
        rangeKey,
        spendingPieColors,
        theCustomRange,
      );
      setIncomeDistribution(incomeCategories);
      const loanData = await getLoanReport(rangeKey, theCustomRange);
      setLoanReport(loanData);

      // Get percentage spending report
      const psr = await getSpendingDistribution(
        rangeKey,
        spendingPieColors,
        theCustomRange,
      );
      setPercentageSpendingReport(psr);

      // Get importance distribution data
      const impData = await getImportanceDistribution(rangeKey, theCustomRange);
      setImportanceData(impData);

      // Hide loading
      setShowLoading(false);
    },
    [spendingPieColors],
  );

  /** انتخاب بازه گزارش؛ بازه دلخواه، تاریخ‌های از / تا را هم نشان می‌دهد. */
  const handleSelect = async (rangeKey: RangeType): Promise<void> => {
    setSelectedRange(rangeKey);

    // ← بازه دلخواه: نمایش تاریخ های از / تا و گرفتن گزارش همان بازه
    if (rangeKey === "custom") {
      const theCustomRange = customRange ?? getDefaultCustomRange();

      setCustomRange(theCustomRange);
      setShowCustomDates(true);

      fetchData("custom", theCustomRange);

      return;
    }

    setShowCustomDates(false);

    fetchData(rangeKey);
  };

  /** تغییر یکی از تاریخ‌های بازه دلخواه و گرفتن گزارش همان بازه. */
  const handleCustomDateChange = (
    which: "from" | "to",
    date: string,
  ): void => {
    const theCustomRange = customRange ?? getDefaultCustomRange();

    const updatedRange: CustomRange =
      which === "from"
        ? { ...theCustomRange, startDate: date }
        : { ...theCustomRange, endDate: date };

    setCustomRange(updatedRange);

    // ← تاریخ شروع نباید بعد از تاریخ پایان باشد
    if (updatedRange.startDate > updatedRange.endDate) {
      toast.warning("تاریخ شروع باید قبل از تاریخ پایان باشد!");
      return;
    }

    fetchData("custom", updatedRange);
  };

  // دریافت اطلاعات این ماه موقع بارگذاری صفحه
  useEffect(() => {
    const fetchInitialReport = async () => {
      await fetchData("month");
    };

    fetchInitialReport();
  }, [fetchData]);

  // داده‌ها از صفحه تنظیمات بازگردانی یا پاک شدند: همان بازه فعلی دوباره خونده بشه
  useEffect(() => {
    if (dataRevision === 0) return;

    const refetchCurrentRange = async () => {
      const { range, custom } = latestSelection.current;

      await fetchData(
        range,
        range === "custom" ? (custom ?? getDefaultCustomRange()) : undefined,
      );
    };

    refetchCurrentRange();
  }, [dataRevision, fetchData]);

  return {
    showLoading,
    selectedRange,
    customRange,
    showCustomDates,
    overalSpendingReport,
    overalIncomeReport,
    incomeDistribution,
    loanReport,
    percentageSpendingReport,
    importanceData,
    handleSelect,
    handleCustomDateChange,
  };
}

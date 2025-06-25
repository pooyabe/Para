import { useShamsiDate } from "@/hooks/BackEnd/useShamsiDate";
import { addSpending, getSpendingOptions } from "@/hooks/DB";
import numberToText from "@/hooks/numberToText";
import { useEffect, useState } from "react";
import { toast } from "sonner-native";

export const useSpendingForm = () => {
  const [spending_amount, setAmount] = useState(0);
  const [importance, setImportance] = useState(0);
  const [spending_date, setDate] = useState<string | undefined>();
  const [shamsiSpendingDate, setShamsiSpendingDate] = useState<
    string | undefined
  >();
  const [spendingReason, setSpendingReason] = useState<string | null>(null);
  // برای نمایش متن قیمت
  const [thePriceString, setThePriceString] = useState("");

  const printPriceString = (val: any) => {
    setThePriceString(numberToText(val));

    setAmount(val);
  };

  // تبدیل تاریخ شمسی به میلادی
  const { toGregorian } = useShamsiDate();
  const handleDateChange = (date: string) => {
    const georgianDate = toGregorian(date);

    // Store Shamsi Date for using in UI
    setShamsiSpendingDate(date);

    // Store GeorgianDate for using in DataBase
    setDate(georgianDate);
  };

  // دریافت لیست‌ها از دیتابیس
  const [reasons, setReasons] = useState<
    Array<{ label: string; value: string }>
  >([]);
  useEffect(() => {
    const fetchOptions = async () => {
      const [reasonOpts] = await Promise.all([getSpendingOptions()]);
      setReasons(
        reasonOpts.map((opt: any) => ({
          label: opt.label,
          value: opt.value,
        }))
      );
    };

    fetchOptions();

    // Set the current day as default
    const { nowJalali } = useShamsiDate();
    handleDateChange(nowJalali());
  }, []);

  // ذخیره‌سازی داده‌ها
  const saveSpending = async () => {
    if (
      spending_amount === undefined ||
      spending_amount === null ||
      !spendingReason ||
      !spending_date ||
      importance === undefined ||
      importance === null
    ) {
      // Show a Warning
      toast.warning("همه گزینه‌ها الزامی ان!");
      return;
    }

    try {
      await addSpending({
        amount: Number(spending_amount),
        reasonTitle: spendingReason,
        importance: String(importance),
        transactionDate: spending_date,
      });
      toast.success("ذخیره شد ;)");
    } catch (e) {
      toast.error("خطا در ذخیره سازی داده!");
      console.error("❌ خطا در ذخیره:", e);
    }
  };

  /**
   *
   * Export
   *
   */
  return {
    spending_amount,
    setAmount,
    importance,
    setImportance,
    spending_date,
    setDate,
    spendingReason,
    setSpendingReason,
    thePriceString,
    setThePriceString,
    printPriceString,
    handleDateChange,
    reasons,
    setReasons,
    saveSpending,
    shamsiSpendingDate,
  };
};

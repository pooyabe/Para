import { useShamsiDate } from "@/hooks/BackEnd/useShamsiDate";
import { addSpending, getSpendingOptions } from "@/hooks/DB";
import numberToText from "@/hooks/numberToText";
import { useEffect, useState } from "react";

export const useSpendingForm = () => {
  const [spending_amount, setAmount] = useState();
  const [importance, setImportance] = useState("الکی");
  const [spending_date, setDate] = useState();
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
    setDate(georgianDate);
  };

  // دریافت لیست‌ها از دیتابیس
  const [reasons, setReasons] = useState<Array<{ id: number; title: string }>>(
    []
  );
  useEffect(() => {
    const fetchOptions = async () => {
      const [reasonOpts] = await Promise.all([getSpendingOptions()]);
      setReasons(reasonOpts);
    };

    fetchOptions();
  }, []);

  // ذخیره‌سازی داده‌ها
  const saveSpending = async () => {
    if (!spending_amount || !spendingReason || !spending_date || importance === "") {
      alert("لطفاً همه فیلدها را پر کنید!");
      return;
    }

    try {
      await addSpending({
        amount: Number(spending_amount),
        reasonTitle: spendingReason,
        importance: importance,
        transactionDate: spending_date,
      });
      alert("✅ ذخیره شد!");
    } catch (e) {
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
  };
};

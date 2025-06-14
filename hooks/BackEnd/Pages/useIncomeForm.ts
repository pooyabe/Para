// hooks/useIncomeForm.ts
import { useShamsiDate } from "@/hooks/BackEnd/useShamsiDate";
import { addIncome, getIncomeDestinations, getIncomeReasons } from "@/hooks/DB";
import numberToText from "@/hooks/numberToText";
import { useEffect, useState } from "react";

export const useIncomeForm = () => {
  // حالت‌های فرم
  const [income_amount, setAmount] = useState("");
  const [income_reason, setReason] = useState<string | null>(null);
  const [where_stored, setWhereStored] = useState<string | null>(null);
  const [income_date, setDate] = useState("");
  const [shamsiIncomeDate, setShamsiIncomeDate] = useState();
  const [thePriceString, setThePriceString] = useState("");

  // حالت‌های لیست‌های dropdown
  const [reasons, setReasons] = useState<Array<{ id: number; title: string }>>(
    []
  );
  const [destinations, setDestinations] = useState<
    Array<{ id: number; title: string }>
  >([]);

  // تبدیل عدد به متن
  const printPriceString = (val: string) => {
    setThePriceString(numberToText(val));
    setAmount(val);
  };

  // تبدیل تاریخ شمسی به میلادی
  const { toGregorian } = useShamsiDate();
  const handleDateChange = (date: string) => {
    // Store Shamsi Date for UI
    setShamsiIncomeDate(date);

    // Store Georgian Date for DataBase
    const georgianDate = toGregorian(date);
    setDate(georgianDate);
  };

  // دریافت لیست‌ها از دیتابیس
  useEffect(() => {
    const fetchOptions = async () => {
      const [reasonOpts, destinationOpts] = await Promise.all([
        getIncomeReasons(),
        getIncomeDestinations(),
      ]);
      setReasons(reasonOpts);
      setDestinations(destinationOpts);
    };

    fetchOptions();
  }, []);

  // ذخیره‌سازی داده‌ها
  const saveIncome = async () => {
    if (!income_reason || !where_stored || !income_date) {
      alert("لطفاً همه فیلدها را پر کنید!");
      return;
    }

    try {
      await addIncome({
        amount: Number(income_amount),
        reasonTitle: income_reason.trim(),
        destinationTitle: where_stored.trim(),
        transactionDate: income_date,
      });
      alert("✅ ذخیره شد!");
    } catch (e) {
      console.error("❌ خطا در ذخیره:", e);
    }
  };

  // تمام حالت‌ها و متدها را به کامپوننت اصلی بازمی‌گردانیم
  return {
    income_amount,
    income_reason,
    where_stored,
    income_date,
    thePriceString,
    reasons,
    destinations,
    printPriceString,
    handleDateChange,
    setReason,
    setWhereStored,
    saveIncome,
    shamsiIncomeDate,
  };
};

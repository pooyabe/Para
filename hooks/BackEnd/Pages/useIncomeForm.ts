// hooks/useIncomeForm.ts
import { useShamsiDate } from "@/hooks/BackEnd/useShamsiDate";
import { addIncome, getIncomeDestinations, getIncomeReasons, getReceivableLoanOptions } from "@/hooks/DB";
import numberToText from "@/hooks/numberToText";
import { useEffect, useState } from "react";
import { toast } from "sonner-native";

export const useIncomeForm = () => {
  // حالت‌های فرم
  const [income_amount, setAmount] = useState<number | null>();
  const [income_reason, setReason] = useState<string | null>(null);
  const [where_stored, setWhereStored] = useState<string | null>(null);
  const [income_date, setDate] = useState("");
  const [shamsiIncomeDate, setShamsiIncomeDate] = useState<
    string | undefined
  >();
  const [thePriceString, setThePriceString] = useState("");

  // حالت‌های لیست‌های dropdown
  const [reasons, setReasons] = useState<
    Array<{ label: string; value: string }>
  >([]);
  const [destinations, setDestinations] = useState<
    Array<{ label: string; value: string }>
  >([]);
  const [receivableLoans, setReceivableLoans] = useState<
    Array<{ id: number; label: string; value: string; type: string }>
  >([]);

  // تبدیل عدد به متن
  const printPriceString = (val: number | null) => {
    setThePriceString(numberToText(Number(val)));

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
      const [reasonOpts, destinationOpts, loanOpts] = await Promise.all([
        getIncomeReasons(),
        getIncomeDestinations(),
        getReceivableLoanOptions(),
      ]);
      setReasons(
        reasonOpts.map((item: any) => ({
          label: item.label,
          value: item.value,
        }))
      );
      setDestinations(
        destinationOpts.map((item: any) => ({
          label: item.label,
          value: item.value,
        }))
      );
      setReceivableLoans(loanOpts);
    };

    fetchOptions();

    // Set the current day as default
    const { nowJalali } = useShamsiDate();
    handleDateChange(nowJalali());
  }, []);

  // ذخیره‌سازی داده‌ها
  const saveIncome = async () => {
    if (!income_reason || !where_stored || !income_date) {
      // Show a Warning
      toast.warning("همه گزینه‌ها الزامی ان!");
      return;
    }

    try {
      // Save Data
      await addIncome({
        amount: Number(income_amount),
        reasonTitle: income_reason.trim(),
        destinationTitle: where_stored.trim(),
        transactionDate: income_date,
      });

      // Reset form
      printPriceString(null);

      // Show success message
      toast.success("ذخیره شد ;)");
    } catch (e) {
      toast.error("خطا در ذخیره سازی داده!");
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
    receivableLoans,
    printPriceString,
    handleDateChange,
    setReason,
    setWhereStored,
    saveIncome,
    shamsiIncomeDate,
  };
};
import { useShamsiDate } from "@/hooks/BackEnd/useShamsiDate";
import {
  addLoan,
  getPayableLoanOptions,
  getReceivableLoanOptions,
} from "@/hooks/DB";
import numberToText from "@/hooks/numberToText";
import { useEffect, useState } from "react";
import { toast } from "sonner-native";

export const useLoanForm = () => {
  // تبدیل تاریخ شمسی به میلادی
  const { toGregorian, nowJalali } = useShamsiDate();
  const todayJalali = nowJalali();
  const todayGregorian = toGregorian(todayJalali);

  const [loan_type, setLoanType] = useState<"receivable" | "payable">(
    "receivable",
  );
  const [loan_amount, setLoanAmount] = useState<number | null>(null);
  const [loan_source, setLoanSource] = useState<string | null>(null);
  const [loan_description, setLoanDescription] = useState<string>("");
  const [loan_start_date, setLoanStartDate] = useState<string>(todayGregorian);
  const [loan_end_date, setLoanEndDate] = useState<string>(todayGregorian);
  const [shamsiStartDate, setShamsiStartDate] = useState<string | undefined>(
    todayJalali,
  );
  const [shamsiEndDate, setShamsiEndDate] = useState<string | undefined>(
    todayJalali,
  );
  const [thePriceString, setThePriceString] = useState("");
  // تبدیل عدد به متن
  const printPriceString = (val: number | null) => {
    setThePriceString(numberToText(Number(val)));
    setLoanAmount(val);
  };

  const handleStartDateChange = (date: string) => {
    setShamsiStartDate(date);
    const georgianDate = toGregorian(date);
    setLoanStartDate(georgianDate);
  };

  const handleEndDateChange = (date: string) => {
    setShamsiEndDate(date);
    const georgianDate = toGregorian(date);
    setLoanEndDate(georgianDate);
  };

  // دریافت لیست‌های وام‌ها برای انتخاب در درآمد/هزینه
  const [payableLoans, setPayableLoans] = useState<
    Array<{ id: number; label: string; value: string; type: string }>
  >([]);
  const [receivableLoans, setReceivableLoans] = useState<
    Array<{ id: number; label: string; value: string; type: string }>
  >([]);

  useEffect(() => {
    const fetchLoanOptions = async () => {
      const [payable, receivable] = await Promise.all([
        getPayableLoanOptions(),
        getReceivableLoanOptions(),
      ]);
      setPayableLoans(payable);
      setReceivableLoans(receivable);
    };
    fetchLoanOptions();
  }, []);

  // ذخیره‌سازی داده‌ها
  const saveLoan = async () => {
    if (
      !loan_source ||
      !loan_start_date ||
      !loan_end_date ||
      loan_amount === null ||
      loan_amount === undefined
    ) {
      toast.warning("همه گزینه‌های الزامی را پر کنید!");
      return false;
    }

    try {
      await addLoan({
        type: loan_type,
        amount: Number(loan_amount),
        source: loan_source.trim(),
        description: loan_description.trim() || undefined,
        startDate: loan_start_date,
        endDate: loan_end_date,
      });

      printPriceString(null);
      setLoanSource(null);
      setLoanDescription("");
      setLoanType("receivable");
      const currentToday = nowJalali();
      handleStartDateChange(currentToday);
      handleEndDateChange(currentToday);
      toast.success("وام با موفقیت ذخیره شد ;)");
      return true;
    } catch (e) {
      toast.error("خطا در ذخیره‌سازی وام!");
      console.error("❌ خطا در ذخیره:", e);
      return false;
    }
  };

  // تمام حالت‌ها و متدها را به کامپوننت اصلی بازمی‌گردانیم
  return {
    loan_type,
    setLoanType,
    loan_amount,
    setLoanAmount,
    loan_source,
    setLoanSource,
    loan_description,
    setLoanDescription,
    loan_start_date,
    loan_end_date,
    shamsiStartDate,
    shamsiEndDate,
    thePriceString,
    payableLoans,
    receivableLoans,
    printPriceString,
    handleStartDateChange,
    handleEndDateChange,
    saveLoan,
  };
};

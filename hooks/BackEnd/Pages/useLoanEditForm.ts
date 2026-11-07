import { useShamsiDate } from "@/hooks/BackEnd/useShamsiDate";
import { updateLoan } from "@/hooks/DB";
import type { Loan } from "@/hooks/DB/actions/getLoans";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { toast } from "sonner-native";
import { useLoanForm } from "./useLoanForm";

/**
 * فرم ویرایش یک مورد بده‌بستون.
 *
 * فرم خالی و قواعد اعتبارسنجی از `useLoanForm` می‌آید؛ این هوک فقط مورد
 * انتخاب‌شده را داخل فرم می‌ریزد و ذخیره تغییرات را انجام می‌دهد.
 */
export function useLoanEditForm() {
  const { loan } = useLocalSearchParams<{ loan: string }>();
  const { toJalali } = useShamsiDate();
  const form = useLoanForm();

  const [loanData, setLoanData] = useState<Loan | null>(null);
  const [loading, setLoading] = useState(true);

  const {
    loan_type,
    loan_amount,
    loan_source,
    loan_description,
    loan_start_date,
    loan_end_date,
    setLoanType,
    setLoanAmount,
    setLoanSource,
    setLoanDescription,
    printPriceString,
    handleStartDateChange,
    handleEndDateChange,
  } = form;

  useEffect(() => {
    const loadLoan = async () => {
      try {
        if (loan) {
          const parsedLoan: Loan = JSON.parse(loan);
          setLoanData(parsedLoan);

          // Populate form with existing data
          setLoanType(parsedLoan.type);
          setLoanAmount(parsedLoan.amount);
          setLoanSource(parsedLoan.source);
          setLoanDescription(parsedLoan.description || "");
          printPriceString(parsedLoan.amount);

          // Convert dates to Shamsi for display
          handleStartDateChange(toJalali(parsedLoan.start_date));
          handleEndDateChange(toJalali(parsedLoan.end_date));
        }
      } catch (error) {
        console.error("Error loading loan:", error);
      } finally {
        setLoading(false);
      }
    };
    loadLoan();
  }, [loan]);

  /** تغییرات فرم را ذخیره می‌کند و در صورت موفقیت `true` برمی‌گرداند. */
  const saveLoanEdit = async (): Promise<boolean> => {
    if (
      !loanData ||
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
      await updateLoan({
        id: loanData.id,
        type: loan_type,
        amount: Number(loan_amount),
        source: loan_source.trim(),
        description: loan_description.trim() || undefined,
        startDate: loan_start_date,
        endDate: loan_end_date,
      });

      toast.success("وام با موفقیت ویرایش شد ;)");
      return true;
    } catch (e) {
      toast.error("خطا در ویرایش وام!");
      console.error("❌ خطا در ویرایش:", e);
      return false;
    }
  };

  return { ...form, loading, saveLoanEdit };
}

import {
  Date,
  Div,
  Input,
  Mother,
  Radio,
  SButton,
  Spacer,
  Span,
} from "@/components/Elements";
import { useLoanForm } from "@/hooks/BackEnd/Pages/useLoanForm";
import { useShamsiDate } from "@/hooks/BackEnd/useShamsiDate";
import { updateLoan } from "@/hooks/DB";
import { Loan } from "@/hooks/DB/actions/getLoans";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { toast } from "sonner-native";

export default function EditLoanPage() {
  const { loan } = useLocalSearchParams<{ loan: string }>();
  const { toJalali } = useShamsiDate();
  const {
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
    printPriceString,
    handleStartDateChange,
    handleEndDateChange,
  } = useLoanForm();

  const [loanData, setLoanData] = useState<Loan | null>(null);
  const [loading, setLoading] = useState(true);

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
          const startDateShamsi = toJalali(parsedLoan.start_date);
          const endDateShamsi = toJalali(parsedLoan.end_date);
          handleStartDateChange(startDateShamsi);
          handleEndDateChange(endDateShamsi);
        }
      } catch (error) {
        console.error("Error loading loan:", error);
      } finally {
        setLoading(false);
      }
    };
    loadLoan();
  }, [loan]);

  const handleSave = async () => {
    if (
      !loanData ||
      !loan_source ||
      !loan_start_date ||
      !loan_end_date ||
      loan_amount === null ||
      loan_amount === undefined
    ) {
      toast.warning("همه گزینه‌های الزامی را پر کنید!");
      return;
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
      router.back();
    } catch (e) {
      toast.error("خطا در ویرایش وام!");
      console.error("❌ خطا در ویرایش:", e);
    }
  };

  if (loading) {
    return (
      <Mother style={styles.loadingContainer}>
        <Span style={styles.loadingText}>در حال بارگذاری...</Span>
      </Mother>
    );
  }

  return (
    <Mother>
      <Div style={styles.container}>
        <Span type="title" style={styles.pageTitle}>
          ویرایش وام
        </Span>

        <Radio
          Items={["قرض دادم", "پول گرفتم"]}
          onChangeValueWithIndex={(value, index) => {
            setLoanType(index === 0 ? "receivable" : "payable");
          }}
        />

        <Spacer height={20} />

        <Input
          label="مبلغ وام"
          type="number"
          onChangeText={(value) => printPriceString(Number(value))}
          value={loan_amount?.toString() ?? ""}
        />
        <Spacer height={5} />
        <Span type="subtitle" style={{ color: "#118dff" }}>
          {thePriceString}
        </Span>

        <Spacer height={20} />

        <Input
          label="محل/شخص وام"
          placeholder="عنوان وام"
          onChangeText={(value) => setLoanSource(value)}
          value={loan_source ?? ""}
        />

        <Spacer height={20} />

        <Input
          label="توضیحات (اختیاری)"
          placeholder="توضیحات بیشتر"
          onChangeText={(value) => setLoanDescription(value)}
          value={loan_description ?? ""}
        />

        <Spacer height={20} />

        <Span type="subtitle">تاریخ شروع</Span>
        <Date
          SelectedDate={shamsiStartDate}
          onDateChange={(date: string) => {
            handleStartDateChange(date);
          }}
          style={{}}
          todayMax
        />

        <Spacer height={20} />

        <Span type="subtitle">تاریخ تسویه</Span>
        <Date
          SelectedDate={shamsiEndDate}
          onDateChange={(date: string) => {
            handleEndDateChange(date);
          }}
          style={{}}
        />

        <Spacer />

        <SButton text="ذخیره تغییرات" onPress={handleSave} />
      </Div>
    </Mother>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    fontSize: 16,
  },
  pageTitle: {
    marginVertical: 20,
    fontSize: 24,
  },
});

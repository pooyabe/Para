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
import { StyleSheet } from "react-native";

export default function AddLoanPage() {
  const {
    loan_type,
    setLoanType,
    loan_amount,
    loan_source,
    loan_description,
    shamsiStartDate,
    shamsiEndDate,
    thePriceString,
    printPriceString,
    handleStartDateChange,
    handleEndDateChange,
    saveLoan,
    setLoanSource,
    setLoanDescription,
  } = useLoanForm();

  return (
    <Mother>
      <Div style={styles.container}>
        <Span type="title" style={styles.pageTitle}>
          وام جدید
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

        <SButton text="ذخیره وام" onPress={saveLoan} />
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

  pageTitle: {
    marginVertical: 20,
    fontSize: 24,
  },
});

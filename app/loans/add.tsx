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
import { Colors } from "@/constants/Colors";
import { useLoanForm } from "@/hooks/BackEnd/Pages/useLoanForm";
import { formatAmountInput, parseAmountInput } from "@/hooks/BackEnd/formatAmountInput";
import { useColorScheme } from "@/hooks/useColorScheme";
import { router } from "expo-router";
import { StyleSheet } from "react-native";

export default function AddLoanPage() {
  const colors = Colors[useColorScheme()];

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

  const isReceivable = loan_type === "receivable";

  const handleSave = async () => {
    const success = await saveLoan();
    if (success) {
      router.back();
    }
  };

  return (
    <Mother>
      <Div style={styles.container}>
        <Span type="title" style={styles.pageTitle}>
          وام جدید
        </Span>

        <Radio
          Items={["قرض دادم", "پول گرفتم"]}
          selectedIndex={isReceivable ? 0 : 1}
          onChangeValueWithIndex={(value, index) => {
            setLoanType(index === 0 ? "receivable" : "payable");
          }}
        />

        <Spacer height={20} />

        <Input
          label={isReceivable ? "چقدر قرض دادی؟" : "چقدر گرفتی؟"}
          type="number"
          onChangeText={(value) => printPriceString(parseAmountInput(value))}
          value={formatAmountInput(loan_amount)}
        />
        <Spacer height={5} />
        <Span type="subtitle" style={{ color: colors.theLightBlue }}>
          {thePriceString}
        </Span>

        <Spacer height={20} />

        <Input
          label={isReceivable ? "به کی دادی؟" : "از کی گرفتی؟"}
          placeholder={isReceivable ? "نام شخص یا محل" : "نام وام یا شخص"}
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

        <Span type="subtitle">
          {isReceivable ? "تاریخ قرض دادن" : "تاریخ دریافت"}
        </Span>
        <Date
          SelectedDate={shamsiStartDate}
          onDateChange={(date: string) => {
            handleStartDateChange(date);
          }}
          style={{}}
          todayMax
        />

        <Spacer height={20} />

        <Span type="subtitle">
          {isReceivable ? "تاریخ پس گرفتن" : "تاریخ سررسید بازپرداخت"}
        </Span>
        <Date
          SelectedDate={shamsiEndDate}
          onDateChange={(date: string) => {
            handleEndDateChange(date);
          }}
          style={{}}
        />

        <Spacer />

        <SButton text="ذخیره وام" onPress={handleSave} />
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

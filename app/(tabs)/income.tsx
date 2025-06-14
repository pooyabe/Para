import { Date, Div, Input, Mother, SButton, Select, Spacer, Span } from "@/components";
import { useIncomeForm } from "@/hooks/BackEnd/Pages/useIncomeForm";
import { StyleSheet } from "react-native";

export default function IncomePage() {
  const {
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
  } = useIncomeForm();
  // The UI
  return (
    <Mother>
      <Div style={styles.container}>
        <Input
          label="چقد گرفتی؟"
          type="number"
          onChangeText={(value) => printPriceString(value)}
        />
        <Spacer height={5} />
        <Span type="subtitle" style={{ color: "#118cfe" }}>
          {thePriceString}
        </Span>

        <Spacer height={20} />

        <Select
          label="واسه چی گرفتی؟"
          searchable={true}
          placeholder="چرا بهت پول دادن؟"
          onValueChange={(value: string) => {
            setReason(value);
          }}
          items_array={reasons}
        />

        <Spacer height={40} />

        <Select
          label="کجا ریختن؟"
          searchable={true}
          placeholder="نقده؟ بانکیه؟ چیه؟"
          onValueChange={(value: string) => {
            setWhereStored(value);
          }}
          items_array={destinations}
        />

        <Spacer height={40} />

        <Date
          SelectedDate={shamsiIncomeDate}
          onDateChange={(date: Date) => {
            handleDateChange(date);
          }}
        />

        <Spacer height={100} />

        <SButton text="ثبت شه" onPress={saveIncome} />
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
});

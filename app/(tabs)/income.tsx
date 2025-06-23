import {
  Date,
  Div,
  Input,
  Mother,
  SButton,
  Select,
  Spacer,
  Span,
} from "@/components/Elements";
import { useIncomeForm } from "@/hooks/BackEnd/Pages/useIncomeForm";
import { StyleSheet } from "react-native";

export default function IncomePage() {
  const {
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
          onDateChange={(date: string) => {
            handleDateChange(date);
          }}
          style={{}} // Add an empty style object or customize as needed
          todayMax
        />

        <Spacer height={100} />

        <SButton text="بریز" onPress={saveIncome} />
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

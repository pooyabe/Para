import {
  Date,
  Div,
  Input,
  Mother,
  Radio,
  SButton,
  Select,
  Spacer,
  Span,
} from "@/components/Elements";
import { useSpendingForm } from "@/hooks/BackEnd/Pages/useSpendingForm";

import { StyleSheet } from "react-native";

export default function HomeScreen() {
  // Load BackEnd
  const {
    reasons,
    printPriceString,
    thePriceString,
    setSpendingReason,
    setImportance,
    handleDateChange,
    saveSpending,
    spending_date,
    shamsiSpendingDate,
    spending_amount,
  } = useSpendingForm();

  return (
    <Mother>
      <Div style={styles.container}>
        <Span
          type="title"
          style={{
            marginVertical: 40,
            fontSize: 24,
          }}
        >
          هزینه
        </Span>
        <Input
          label="چقد شد؟"
          type="number"
          onChangeText={(value) => printPriceString(Number(value))}
          value={spending_amount?.toString() ?? ""}
        />
        <Spacer height={5} />
        <Span type="subtitle" style={{ color: "#118dff" }}>
          {thePriceString}
        </Span>

        <Spacer height={20} />

        <Select
          label="چی خریدی؟"
          searchable={true}
          placeholder="برای چی ازت کم شد؟"
          onValueChange={(value: string) => {
            setSpendingReason(value);
          }}
          items_array={reasons}
        />

        <Spacer height={5} />

        <Radio
          Items={["الکی", "بگی نگی", "ضروری"]}
          onChangeValueWithIndex={(value, index) => {
            setImportance(index);
          }}
        />

        <Spacer height={40} />

        <Date
          SelectedDate={shamsiSpendingDate}
          onDateChange={(date: string) => {
            handleDateChange(date);
          }}
          style={{}} // Add an empty style object or customize as needed
          todayMax
        />

        <Spacer />

        <SButton text="بردار" onPress={saveSpending} />
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

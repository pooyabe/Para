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
} from "@/components";
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
  } = useSpendingForm();

  return (
    <Mother>
      <Div style={styles.container}>
        <Input
          label="چقد شد؟"
          type="number"
          onChangeText={(value) => printPriceString(value)}
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

        <Spacer height={20} />

        <Radio
          Items={["الکی", "میشد خرج نشه", "ضروری"]}
          onChangeValueWithIndex={(value, index) => {
            setImportance(value);
          }}
        />

        <Spacer height={40} />

        <Date
          onDateChange={(date) => {
            handleDateChange(date);
          }}
        />

        <Spacer height={100} />

        <SButton text="ثبت شه" onPress={saveSpending} />
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

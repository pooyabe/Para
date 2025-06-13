import { Date, Div, Input, Mother, Radio, SButton, Select, Spacer, Span } from "@/components";

import numberToText from "@/hooks/numberToText";
import { useState } from "react";
import { StyleSheet } from "react-native";

export default function HomeScreen() {
  const [thePriceString, setThePriceString] = useState("");

  const printPriceString = (val: any) => {
    setThePriceString(numberToText(val));
  };

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
          items_array={[
            { label: "گزینه ۱", value: 1 },
            { label: "گزینه ۲", value: 2 },
          ]}
          onValueChange={(val) => {
            console.log("مقدار انتخاب‌شده:", val);
          }}
        />

        <Spacer height={20} />

        <Radio
          Items={["الکی", "میشد خرج نشه", "ضروری"]}
          onChangeValueWithIndex={(value, index) => {
            console.log("انتخاب شد:", value, "در ایندکس:", index);
          }}
        />

        <Spacer height={40} />

        <Date
          onDateChange={(date: Date) => {
            console.log(date);
          }}
        />

        <Spacer height={100} />

        <SButton text="ثبت شه" />
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

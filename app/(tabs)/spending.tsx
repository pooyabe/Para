import { Div } from "@/components/Div";
import { Input } from "@/components/Input";
import { Mother } from "@/components/Mother";
import { Radio } from "@/components/Radio";
import { Select } from "@/components/Select";
import { Spacer } from "@/components/Spacer";
import { Span } from "@/components/Span";
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
        />

        <Spacer height={20} />

        <Radio Items={["الکی", "میشد خرج نشه", "ضروری"]}/>
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

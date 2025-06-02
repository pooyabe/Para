import { Div } from "@/components/Div";
import { Input } from "@/components/Input";
import { Mother } from "@/components/Mother";
import { Select } from "@/components/Select";
import { Spacer } from "@/components/Spacer";
import { Span } from "@/components/Span";
import numberToText from "@/hooks/numberToText";
import { useState } from "react";
import { StyleSheet } from "react-native";

export default function HomeScreen() {
  const [thePriceString, setThePriceString] = useState("");

  const printPriceString = (val: number) => {
    setThePriceString(numberToText(val));
  };

  const [Card_Items, setItem] = useState([
    { label: "پاسارگاد", value: "pasargad" },
    { label: "ملی", value: "melli" },
    { label: "ملت", value: "mellat" },
    { label: "رسالت", value: "resalat" },
  ]);

  return (
    <Mother>
      <Div style={styles.container}>
        <Input
          label="چقد شد؟"
          type="number"
          onChangeText={(value) => printPriceString(value)}
        />
        <Span type="subtitle" style={{ color: "#118dff" }}>
          {thePriceString}
        </Span>

        <Spacer />

        <Select
          label="با کدوم کارت؟"
          items_array={Card_Items}
          searchable={true}
        />
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

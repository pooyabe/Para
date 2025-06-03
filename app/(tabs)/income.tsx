import { Div } from "@/components/Div";
import { Input } from "@/components/Input";
import { Mother } from "@/components/Mother";
import { SButton } from "@/components/SButton";
import { Select } from "@/components/Select";
import { Spacer } from "@/components/Spacer";
import { Span } from "@/components/Span";
import numberToText from "@/hooks/numberToText";
import { useState } from "react";
import { StyleSheet } from "react-native";

export default function IncomePage() {
  const [thePriceString, setThePriceString] = useState("");

  const printPriceString = (val: any) => {
    setThePriceString(numberToText(val));
  };

  return (
    <Mother>
      <Div style={styles.container}>
        <Input
          label="چقد زدن؟"
          type="number"
          onChangeText={(value) => printPriceString(value)}
        />
        <Spacer height={5} />
        <Span type="subtitle" style={{ color: "#118cfe" }}>
          {thePriceString}
        </Span>

        <Spacer height={20} />

        <Select
          label="واسه چی زدن؟"
          searchable={true}
          placeholder="چرا بهت پول دادن؟"
        />

        <Spacer height={100} />

        <SButton text="ثبت شه"/>
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

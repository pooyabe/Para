import { Div } from "@/components/Div";
import { Input } from "@/components/Input";
import { Mother } from "@/components/Mother";
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

  const [Card_Items, setCard_Item] = useState([
    { label: "پاسارگاد", value: "pasargad" },
    { label: "ملی", value: "melli" },
    { label: "ملت", value: "mellat" },
    { label: "رسالت", value: "resalat" },
  ]);

  const [Reasons, setReasons] = useState([]);

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

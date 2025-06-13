import { Date } from "@/components/Date";
import { Div } from "@/components/Div";
import { Input } from "@/components/Input";
import { Mother } from "@/components/Mother";
import { SButton } from "@/components/SButton";
import { Select } from "@/components/Select";
import { Spacer } from "@/components/Spacer";
import { Span } from "@/components/Span";
import { useShamsiDate } from "@/hooks/BackEnd/useShamsiDate";
import { addIncome } from "@/hooks/DB";
import numberToText from "@/hooks/numberToText";
import { useState } from "react";
import { StyleSheet } from "react-native";

export default function IncomePage() {
  // The inputs states
  const [income_amount, setAmount] = useState("");
  const [income_reason, setReason] = useState("");
  const [where_stored, setWhereStored] = useState("");
  const [income_date, setDate] = useState("");

  // This state is for converting the number input to a text representation
  // which can be used for display purposes, like showing the amount in words.
  const [thePriceString, setThePriceString] = useState("");

  const printPriceString = (val: any) => {
    setThePriceString(numberToText(val));

    setAmount(val); // Update the amount state with the numeric value
  };

  const handleDateChange = (date: any) => {
    const { toGregorian } = useShamsiDate();
    const georgianDate = toGregorian(date);
    setDate(georgianDate);
  };

  /**
   *
   * This function is called when the user clicks the "ثبت شه" button.
   * It should handle the logic for saving the income data.
   *
  **/
  const saveIncome = async () => {
    try {
      await addIncome({
        amount: Number(income_amount),
        reasonTitle: income_reason.trim(),
        destinationTitle: where_stored.trim(),
        transactionDate: income_date,
      });
      alert("✅ ذخیره شد!");
    } catch (e) {
      console.error("❌ خطا در ذخیره:", e);
    }
  };

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
        />

        <Spacer height={40} />

        <Select
          label="کجا ریختن؟"
          searchable={true}
          placeholder="نقده؟ بانکیه؟ چیه؟"
          onValueChange={(value: string) => {
            setWhereStored(value);
          }}
        />

        <Spacer height={40} />

        <Date
          style={{ width: "100%" }}
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

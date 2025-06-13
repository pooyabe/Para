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

import { useShamsiDate } from "@/hooks/BackEnd/useShamsiDate";
import { addSpending, getSpendingOptions } from "@/hooks/DB";
import numberToText from "@/hooks/numberToText";
import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";

export default function HomeScreen() {
  const [spending_amount, setAmount] = useState();
  const [importance, setImportance] = useState("الکی");
  const [spending_date, setDate] = useState();
  const [spendingReason, setSpendingReason] = useState<string | null>(null);

  // برای نمایش متن قیمت
  const [thePriceString, setThePriceString] = useState("");

  const printPriceString = (val: any) => {
    setThePriceString(numberToText(val));

    setAmount(val);
  };

  // تبدیل تاریخ شمسی به میلادی
  const { toGregorian } = useShamsiDate();
  const handleDateChange = (date: string) => {
    const georgianDate = toGregorian(date);
    setDate(georgianDate);
  };

  // دریافت لیست‌ها از دیتابیس
  const [reasons, setReasons] = useState<Array<{ id: number; title: string }>>(
    []
  );
  useEffect(() => {
    const fetchOptions = async () => {
      const [reasonOpts] = await Promise.all([getSpendingOptions()]);
      setReasons(reasonOpts);
    };

    fetchOptions();
  }, []);

  // ذخیره‌سازی داده‌ها
  const saveSpending = async () => {
    if (!spending_amount || !spendingReason || !importance || !spending_date) {
      alert("لطفاً همه فیلدها را پر کنید!");
      return;
    }

    try {
      await addSpending({
        amount: Number(spending_amount),
        reasonTitle: spendingReason,
        importance: importance,
        transactionDate: spending_date,
      });
      alert("✅ ذخیره شد!");
    } catch (e) {
      console.error("❌ خطا در ذخیره:", e);
    }
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

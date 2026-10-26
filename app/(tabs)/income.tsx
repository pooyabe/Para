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
import { Colors } from "@/constants/Colors";
import { useIncomeForm } from "@/hooks/BackEnd/Pages/useIncomeForm";
import { useColorScheme } from "@/hooks/useColorScheme";
import { StyleSheet } from "react-native";

export default function IncomePage() {
  const colors = Colors[useColorScheme()];

  const {
    thePriceString,
    reasons,
    destinations,
    receivableLoans,
    printPriceString,
    handleDateChange,
    setReason,
    setWhereStored,
    saveIncome,
    shamsiIncomeDate,
    income_amount,
  } = useIncomeForm();
  // The UI
  return (
    <Mother>
      <Div style={styles.container}>
        <Spacer />
        <Span type="title" style={styles.pageTitle}>
          ایول پول اومده :)
        </Span>
        <Input
          label="چقد گرفتی؟"
          type="number"
          onChangeText={(value) => printPriceString(Number(value))}
          value={income_amount?.toString() ?? ""}
        />
        <Spacer height={5} />
        <Span type="subtitle" style={{ color: colors.theLightBlue }}>
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
          items_array={[
            ...reasons,
            ...receivableLoans.map((loan) => ({
              label: `💰 ${loan.label}`,
              value: loan.value,
            })),
          ]}
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

        <Spacer />

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

  pageTitle: {
    marginVertical: 20,
    fontSize: 24,
  },
});

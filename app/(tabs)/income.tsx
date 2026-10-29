import {
  Date,
  Div,
  IconSymbol,
  Input,
  Mother,
  SButton,
  Select,
  Spacer,
  Span,
} from "@/components/Elements";
import { Colors } from "@/constants/Colors";
import { useIncomeForm } from "@/hooks/BackEnd/Pages/useIncomeForm";
import {
  formatAmountInput,
  parseAmountInput,
} from "@/hooks/BackEnd/formatAmountInput";
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
        <Div
          style={[
            styles.titleBar,
            { backgroundColor: colors.card, borderColor: colors.divider },
          ]}
        >
          <Div
            style={[
              styles.titleIcon,
              { backgroundColor: colors.infoBackground },
            ]}
          >
            <IconSymbol
              type="Ionicons"
              name="cash-outline"
              size={22}
              color={colors.tint}
            />
          </Div>
          <Span type="title" style={styles.pageTitle}>
            ایول پول اومده :)
          </Span>
        </Div>

        <Spacer height={50} />

        <Input
          label="چقد گرفتی؟"
          type="number"
          onChangeText={(value) => printPriceString(parseAmountInput(value))}
          value={formatAmountInput(income_amount)}
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

        <Spacer height={20} />

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

  titleBar: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "stretch",
    justifyContent: "center",
    columnGap: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderRadius: 18,
    direction: "rtl",
  },
  titleIcon: {
    width: 40,
    height: 40,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },
  pageTitle: {
    fontSize: 22,
  },
});

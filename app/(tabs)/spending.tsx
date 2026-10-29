import {
  Date,
  Div,
  IconSymbol,
  Input,
  Mother,
  Radio,
  SButton,
  Select,
  Spacer,
  Span,
} from "@/components/Elements";
import { useSpendingForm } from "@/hooks/BackEnd/Pages/useSpendingForm";
import { formatAmountInput, parseAmountInput } from "@/hooks/BackEnd/formatAmountInput";

import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { StyleSheet } from "react-native";

export default function HomeScreen() {
  const colors = Colors[useColorScheme()];

  // Load BackEnd
  const {
    reasons,
    payableLoans,
    printPriceString,
    thePriceString,
    setSpendingReason,
    setImportance,
    handleDateChange,
    saveSpending,
    spending_date,
    shamsiSpendingDate,
    spending_amount,
  } = useSpendingForm();

  return (
    <Mother>
      <Div style={styles.container}>
        <Div
          style={[
            styles.titleBar,
            { backgroundColor: colors.card, borderColor: colors.divider },
          ]}
        >
          <Div style={[styles.titleIcon, { backgroundColor: colors.infoBackground }]}>
            <IconSymbol
              type="Ionicons"
              name="cart-outline"
              size={22}
              color={colors.tint}
            />
          </Div>
          <Span type="title" style={styles.pageTitle}>
            پول پرید؟
          </Span>
        </Div>
        <Spacer height={20} />
        <Input
          label="چقد شد؟"
          type="number"
          onChangeText={(value) => printPriceString(parseAmountInput(value))}
          value={formatAmountInput(spending_amount)}
        />
        <Spacer height={5} />
        <Span type="subtitle" style={{ color: colors.theLightBlue }}>
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
          items_array={[
            ...reasons,
            ...payableLoans.map((loan) => ({
              label: `💳 ${loan.label}`,
              value: loan.value,
            })),
          ]}
        />

        <Spacer height={5} />

        <Radio
          Items={["الکی", "بگی نگی", "ضروری"]}
          onChangeValueWithIndex={(value, index) => {
            setImportance(index);
          }}
        />

        <Spacer height={40} />

        <Date
          SelectedDate={shamsiSpendingDate}
          onDateChange={(date: string) => {
            handleDateChange(date);
          }}
          style={{}} // Add an empty style object or customize as needed
          todayMax
        />

        <Spacer />

        <SButton text="بردار" onPress={saveSpending} />
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
    columnGap: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderRadius: 18,
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

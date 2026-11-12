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
import {
  formatAmountInput,
  parseAmountInput,
} from "@/hooks/BackEnd/formatAmountInput";

import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { StyleSheet } from "react-native";
import { TourTarget } from "react-native-interactive-tour";

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
          <Div
            style={[
              styles.titleIcon,
              { backgroundColor: colors.infoBackground },
            ]}
          >
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
        <Spacer height={50} />
        <TourTarget id="spending.amount" style={styles.tourTarget}>
          <Input
            label="چقد شد؟"
            type="number"
            onChangeText={(value) => printPriceString(parseAmountInput(value))}
            value={formatAmountInput(spending_amount)}
          />
        </TourTarget>
        <Spacer height={5} />
        <Span type="subtitle" style={{ color: colors.theLightBlue }}>
          {thePriceString}
        </Span>

        <Spacer height={20} />

        <TourTarget id="spending.reason" style={styles.tourTarget}>
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
        </TourTarget>

        <Spacer height={0} />

        <TourTarget id="spending.importance" style={styles.tourTarget}>
          <Radio
            Items={["الکی", "بگی نگی", "ضروری"]}
            onChangeValueWithIndex={(value, index) => {
              setImportance(index);
            }}
          />
        </TourTarget>

        <Spacer height={40} />

        <TourTarget id="spending.date" style={styles.tourTarget}>
          <Date
            SelectedDate={shamsiSpendingDate}
            onDateChange={(date: string) => {
              handleDateChange(date);
            }}
            style={{}} // Add an empty style object or customize as needed
            todayMax
          />
        </TourTarget>

        <Spacer height={20} />

        <TourTarget id="spending.save" style={styles.tourTarget}>
          <SButton text="بردار" onPress={saveSpending} />
        </TourTarget>
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
  tourTarget: {
    width: "100%",
  },
});

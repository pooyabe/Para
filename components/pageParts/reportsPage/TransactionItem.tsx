import { Div, Span } from "@/components/Elements";
import { useShamsiDate } from "@/hooks/BackEnd/useShamsiDate";
import { Transaction } from "@/hooks/DB/reports/useTransactions";
import numberToText from "@/hooks/numberToText";
import { StyleSheet } from "react-native";

interface TransactionItemProps {
  transaction: Transaction;
}

export default function TransactionItem({ transaction }: TransactionItemProps) {
  const { toJalali } = useShamsiDate();

  const formattedDate = toJalali(transaction.transaction_date);
  const formattedAmount = numberToText(transaction.amount);

  const isIncome = transaction.type === "income";

  return (
    <Div style={styles.container}>
      <Div style={styles.leftSection}>
        <Span
          style={[
            styles.amount,
            isIncome ? styles.incomeAmount : styles.spendingAmount,
          ]}
        >
          {isIncome ? "+" : "-"}
          {formattedAmount}
        </Span>
        <Span style={styles.reason}>{transaction.reason}</Span>
        {transaction.destination && (
          <Span style={styles.destination}>{transaction.destination}</Span>
        )}
      </Div>
      <Div style={styles.rightSection}>
        <Span style={styles.date}>{formattedDate}</Span>
        <Span style={styles.type}>{isIncome ? "دریافتی" : "هزینه"}</Span>
      </Div>
    </Div>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    marginVertical: 5,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 10,
  },
  leftSection: {
    flex: 1,
  },
  rightSection: {
    alignItems: "flex-end",
  },
  amount: {
    fontSize: 16,
    fontWeight: "bold",
  },
  incomeAmount: {
    color: "#4CAF50", // green
  },
  spendingAmount: {
    color: "#F44336", // red
  },
  reason: {
    fontSize: 14,
    marginTop: 5,
  },
  destination: {
    fontSize: 12,
    color: "#888",
    marginTop: 2,
  },
  date: {
    fontSize: 12,
    color: "#888",
  },
  type: {
    fontSize: 12,
    marginTop: 2,
  },
});

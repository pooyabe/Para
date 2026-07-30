import { Div, IconSymbol, Span } from "@/components/Elements";
import { useShamsiDate } from "@/hooks/BackEnd/useShamsiDate";
import { Transaction } from "@/hooks/DB/reports/useTransactions";
import numberToText from "@/hooks/numberToText";
import { Alert, StyleSheet, TouchableOpacity } from "react-native";
import { useState } from "react";
import EditTransactionModal from "./EditTransactionModal";

interface TransactionItemProps {
  transaction: Transaction;
  onDelete?: (type: string, id: number) => Promise<void>;
  onRefresh?: () => void;
}

export default function TransactionItem({
  transaction,
  onDelete,
  onRefresh,
}: TransactionItemProps) {
  const { toJalali } = useShamsiDate();

  const formattedDate = toJalali(transaction.transaction_date);
  const formattedAmount = numberToText(transaction.amount);

  const isIncome = transaction.type === "income";

  const [modalVisible, setModalVisible] = useState(false);

  const handleEdit = () => {
    setModalVisible(true);
  };

  const handleDelete = () => {
    Alert.alert(
      "حذف تراکنش",
      `آیا می‌خواهید این ${isIncome ? "دریافتی" : "هزینه"} را حذف کنید؟`,
      [
        {
          text: "لغو",
          onPress: () => {},
          style: "cancel",
        },
        {
          text: "حذف",
          onPress: async () => {
            if (onDelete) {
              await onDelete(transaction.type, transaction.id);
            }
          },
          style: "destructive",
        },
      ],
    );
  };

  return (
    <TouchableOpacity activeOpacity={0.8}>
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
          <Div style={styles.rightTopRow}>
            <Span style={styles.date}>{formattedDate}</Span>
            <Span style={styles.type}>{isIncome ? "دریافتی" : "هزینه"}</Span>
          </Div>
          <Div style={styles.actionButtons}>
            <TouchableOpacity onPress={handleEdit} style={styles.iconButton}>
              <IconSymbol
                type="Ionicons"
                name="create-outline"
                size={20}
                color="#2196F3"
              />
            </TouchableOpacity>
            {onDelete && (
              <TouchableOpacity onPress={handleDelete} style={styles.iconButton}>
                <IconSymbol
                  type="Ionicons"
                  name="trash-outline"
                  size={20}
                  color="#F44336"
                />
              </TouchableOpacity>
            )}
          </Div>
        </Div>
      </Div>

      <EditTransactionModal
        visible={modalVisible}
        transaction={transaction}
        onClose={() => setModalVisible(false)}
        onSave={onRefresh || (() => {})}
      />
    </TouchableOpacity>
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
  rightTopRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: 8,
  },
  actionButtons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconButton: {
    padding: 8,
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

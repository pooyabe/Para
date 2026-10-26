import { Div, IconSymbol, Span } from "@/components/Elements";
import { Colors } from "@/constants/Colors";
import { useShamsiDate } from "@/hooks/BackEnd/useShamsiDate";
import { Transaction } from "@/hooks/DB/reports/useTransactions";
import numberToText from "@/hooks/numberToText";
import { Alert, StyleSheet, TouchableOpacity } from "react-native";
import { useState } from "react";
import { useColorScheme } from "@/hooks/useColorScheme";
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
  const colors = Colors[useColorScheme()];
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
      <Div style={[styles.container, { backgroundColor: colors.card }]}>
        <Div style={styles.leftSection}>
          <Span
            style={[
              styles.amount,
              { color: isIncome ? colors.income : colors.theRed },
            ]}
          >
            {isIncome ? "+" : "-"}
            {formattedAmount}
          </Span>
          <Span style={styles.reason}>{transaction.reason}</Span>
          {transaction.destination && (
            <Span style={[styles.destination, { color: colors.muted }]}>
              {transaction.destination}
            </Span>
          )}
        </Div>
        <Div style={styles.rightSection}>
          <Div style={styles.rightTopRow}>
            <Span style={[styles.date, { color: colors.muted }]}>
              {formattedDate}
            </Span>
            <Span style={styles.type}>{isIncome ? "دریافتی" : "هزینه"}</Span>
          </Div>
          <Div style={styles.actionButtons}>
            <TouchableOpacity onPress={handleEdit} style={styles.iconButton}>
              <IconSymbol
                type="Ionicons"
                name="create-outline"
                size={20}
                color={colors.theLightBlue}
              />
            </TouchableOpacity>
            {onDelete && (
              <TouchableOpacity onPress={handleDelete} style={styles.iconButton}>
                <IconSymbol
                  type="Ionicons"
                  name="trash-outline"
                  size={20}
                  color={colors.theRed}
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
  reason: {
    fontSize: 14,
    marginTop: 5,
  },
  destination: {
    fontSize: 12,
    marginTop: 2,
  },
  date: {
    fontSize: 12,
  },
  type: {
    fontSize: 12,
    marginTop: 2,
  },
});

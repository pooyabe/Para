import {
  Date,
  Input,
  Mother,
  Radio,
  SButton,
  Select,
  Spacer,
  Span,
} from "@/components/Elements";
import { useShamsiDate } from "@/hooks/BackEnd/useShamsiDate";
import {
  getIncomeDestinations,
  getIncomeReasons,
  getSpendingOptions,
  updateIncome,
  updateSpending,
} from "@/hooks/DB";
import { Transaction } from "@/hooks/DB/reports/useTransactions";
import numberToText from "@/hooks/numberToText";
import { useColorScheme } from "@/hooks/useColorScheme";
import React, { useEffect, useState } from "react";
import { Modal, StyleSheet, TouchableOpacity, View } from "react-native";
import { toast } from "sonner-native";

interface EditTransactionModalProps {
  transaction: Transaction | null;
  visible: boolean;
  onClose: () => void;
  onSave: () => void;
}

export default function EditTransactionModal({
  transaction,
  visible,
  onClose,
  onSave,
}: EditTransactionModalProps) {
  const { toGregorian, toJalali, nowJalali } = useShamsiDate();
  const colorScheme = useColorScheme() as "light" | "dark";
  const [loadingOptions, setLoadingOptions] = useState(false);

  // Form states - following the same pattern as useSpendingForm/useIncomeForm
  const [amount, setAmount] = useState<string>("");
  const [displayAmount, setDisplayAmount] = useState<string>("");
  const [date, setDate] = useState<string | undefined>();
  const [shamsiDate, setShamsiDate] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);

  // Spending specific
  const [spendingReason, setSpendingReason] = useState<string | null>(null);
  const [importance, setImportance] = useState(0);
  const [spendingReasons, setSpendingReasons] = useState<
    Array<{ label: string; value: string }>
  >([]);

  // Income specific
  const [incomeReason, setIncomeReason] = useState<string | null>(null);
  const [incomeDestination, setIncomeDestination] = useState<string | null>(
    null,
  );
  const [incomeReasons, setIncomeReasons] = useState<
    Array<{ label: string; value: string }>
  >([]);
  const [incomeDestinations, setIncomeDestinations] = useState<
    Array<{ label: string; value: string }>
  >([]);

  const isIncome = transaction?.type === "income";

  // Load options and populate form when transaction changes
  useEffect(() => {
    if (transaction && visible) {
      loadOptions();
      populateForm();
    }
  }, [transaction, visible]);

  const loadOptions = async () => {
    setLoadingOptions(true);
    try {
      if (isIncome) {
        const [reasonOpts, destinationOpts] = await Promise.all([
          getIncomeReasons(),
          getIncomeDestinations(),
        ]);
        setIncomeReasons(
          reasonOpts.map((opt: any) => ({
            label: opt.label,
            value: opt.value,
          })),
        );
        setIncomeDestinations(
          destinationOpts.map((opt: any) => ({
            label: opt.label,
            value: opt.value,
          })),
        );
      } else {
        const [reasonOpts] = await Promise.all([getSpendingOptions()]);
        setSpendingReasons(
          reasonOpts.map((opt: any) => ({
            label: opt.label,
            value: opt.value,
          })),
        );
      }
    } catch (error) {
      console.error("Error loading options:", error);
    } finally {
      setLoadingOptions(false);
    }
  };

  const populateForm = () => {
    if (!transaction) return;

    // Set amount - using the same pattern as printPriceString
    const amountNum = Number(transaction.amount);
    setAmount(String(amountNum));
    setDisplayAmount(numberToText(amountNum));

    // Set date
    const jalaliDate = toJalali(transaction.transaction_date);
    setShamsiDate(jalaliDate);
    setDate(transaction.transaction_date);

    if (isIncome) {
      setIncomeReason(transaction.reason);
      setIncomeDestination(transaction.destination);
    } else {
      setSpendingReason(transaction.reason);
      setImportance(transaction.importance ?? 0);
    }
  };

  const printPriceString = (val: any) => {
    setDisplayAmount(numberToText(Number(val)));
    setAmount(val);
  };

  const handleDateChange = (date: string) => {
    const georgianDate = toGregorian(date);
    setShamsiDate(date);
    setDate(georgianDate);
  };

  const handleSave = async () => {
    if (!transaction) return;

    // Validate
    if (!amount || Number(amount) <= 0) {
      toast.warning("مبلغ باید بزرگتر از صفر باشد");
      return;
    }

    if (!date) {
      toast.warning("تاریخ را انتخاب کنید");
      return;
    }

    if (isIncome) {
      if (!incomeReason || !incomeDestination) {
        toast.warning("دلیل و مقصد را انتخاب کنید");
        return;
      }
    } else {
      if (!spendingReason) {
        toast.warning("دلیل هزینه را انتخاب کنید");
        return;
      }
    }

    setIsLoading(true);

    try {
      let success = false;

      if (isIncome) {
        success = await updateIncome({
          id: transaction.id,
          amount: Number(amount),
          reasonTitle: incomeReason!,
          destinationTitle: incomeDestination!,
          transactionDate: date,
        });
      } else {
        success = await updateSpending({
          id: transaction.id,
          amount: Number(amount),
          reasonTitle: spendingReason!,
          importance: String(importance),
          transactionDate: date,
        });
      }

      if (success) {
        toast.success("تراکنش با موفقیت ویرایش شد");
        onSave();
        onClose();
      } else {
        toast.error("خطا در ویرایش تراکنش");
      }
    } catch (error) {
      console.error("Error updating transaction:", error);
      toast.error("خطا در ویرایش تراکنش");
    } finally {
      setIsLoading(false);
    }
  };

  if (!transaction) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <Mother style={styles.modalContainer} _Hpadding={0}>
        <View style={styles.header}>
          <Span type="title" style={styles.headerTitle}>
            ویرایش {isIncome ? "دریافتی" : "هزینه"}
          </Span>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Span style={styles.closeIcon}>✕</Span>
          </TouchableOpacity>
        </View>

        {loadingOptions ? (
          <View style={styles.loadingContainer}>
            <Span style={styles.loadingText}>در حال بارگذاری...</Span>
          </View>
        ) : (
          <View style={styles.formContainer}>
            {/* Amount - Using Input component like spending.tsx and income.tsx */}
            <View style={styles.fieldGroup}>
              <Input
                label={isIncome ? "چقد گرفتی؟" : "چقد شد؟"}
                type="number"
                onChangeText={(value) => printPriceString(Number(value))}
                value={amount}
              />
              <Spacer height={5} />
              <Span type="subtitle" style={styles.amountDisplay}>
                {displayAmount}
              </Span>
            </View>

            <Spacer height={20} />

            {isIncome ? (
              <>
                {/* Income Reason - Using Select like income.tsx */}
                <Select
                  label="واسه چی گرفتی؟"
                  searchable={true}
                  placeholder="چرا بهت پول دادن؟"
                  onValueChange={(value: string) => {
                    setIncomeReason(value);
                  }}
                  items_array={incomeReasons}
                  initialValue={incomeReason}
                />

                <Spacer height={40} />

                {/* Income Destination - Using Select like income.tsx */}
                <Select
                  label="کجا ریختن؟"
                  searchable={true}
                  placeholder="نقده؟ بانکیه؟ چیه؟"
                  onValueChange={(value: string) => {
                    setIncomeDestination(value);
                  }}
                  items_array={incomeDestinations}
                  initialValue={incomeDestination}
                />

                <Spacer height={40} />
              </>
            ) : (
              <>
                {/* Spending Reason - Using Select like spending.tsx */}
                <Select
                  label="چی خریدی؟"
                  searchable={true}
                  placeholder="برای چی ازت کم شد؟"
                  onValueChange={(value: string) => {
                    setSpendingReason(value);
                  }}
                  items_array={spendingReasons}
                  initialValue={spendingReason}
                />

                <Spacer height={5} />

                {/* Importance - Using Radio like spending.tsx */}
                <Radio
                  Items={["الکی", "بگی نگی", "ضروری"]}
                  onChangeValueWithIndex={(value, index) => {
                    setImportance(index);
                  }}
                />

                <Spacer height={40} />
              </>
            )}

            {/* Date - Using Date component like spending.tsx and income.tsx */}
            <Date
              SelectedDate={shamsiDate || nowJalali()}
              onDateChange={handleDateChange}
              style={{}}
              todayMax
            />

            <Spacer />

            {/* Save Button */}
            <SButton
              text={isLoading ? "در حال ذخیره..." : "ذخیره ویرایش"}
              onPress={handleSave}
              disabled={isLoading}
            />
          </View>
        )}
      </Mother>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerTitle: {
    fontSize: 20,
  },
  closeButton: {
    padding: 10,
  },
  closeIcon: {
    fontSize: 24,
    fontWeight: "bold",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
  },
  formContainer: {
    flex: 1,
    padding: 20,
    width: "100%",
  },
  fieldGroup: {
    marginBottom: 20,
    width: "100%",
  },
  amountDisplay: {
    color: "#118dff",
  },
  saveButton: {
    marginTop: 20,
    paddingVertical: 15,
    width: "100%",
  },
});

import {
  Div,
  IconSymbol,
  Mother,
  Select,
  Spacer,
  Span,
} from "@/components/Elements";
import { Colors } from "@/constants/Colors";
import { useShamsiDate } from "@/hooks/BackEnd/useShamsiDate";
import { deleteLoan, getLoanPayments, getLoans, LoanPayment } from "@/hooks/DB";
import { Loan } from "@/hooks/DB/actions/getLoans";
import { useColorScheme } from "@/hooks/useColorScheme";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { toast } from "sonner-native";

export default function LoansPage() {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<"all" | "active" | "settled">("all");
  const [modalLoan, setModalLoan] = useState<Loan | null>(null);
  const [modalPayments, setModalPayments] = useState<LoanPayment[]>([]);
  const [modalLoading, setModalLoading] = useState<boolean>(false);

  const colorScheme = useColorScheme() as "light" | "dark";
  const { toJalali } = useShamsiDate();

  const loadLoans = useCallback(async () => {
    setLoading(true);
    try {
      let loanList: Loan[];
      if (viewMode === "settled") {
        loanList = await getLoans(true);
        loanList = loanList.filter((l) => l.is_settled === 1);
      } else if (viewMode === "active") {
        loanList = await getLoans(false);
        loanList = loanList.filter(
          (l) => l.is_settled === 0 || l.is_settled === undefined,
        );
      } else {
        loanList = await getLoans(true);
        loanList = loanList.filter((l) => l.is_settled === 0);
      }
      setLoans(loanList);
    } catch (error) {
      console.error("Error loading loans:", error);
    } finally {
      setLoading(false);
    }
  }, [viewMode]);

  useEffect(() => {
    loadLoans();
  }, [loadLoans]);

  // Refresh when screen gains focus
  useFocusEffect(
    useCallback(() => {
      loadLoans();
    }, [loadLoans]),
  );

  const handleDeleteLoan = async (id: number) => {
    Alert.alert("حذف", "آیا می‌خواهید این مورد را حذف کنید؟", [
      {
        text: "لغو",
        onPress: () => {},
        style: "cancel",
      },
      {
        text: "حذف",
        onPress: async () => {
          try {
            const success = await deleteLoan(id);
            if (success) {
              setLoans((prev) => prev.filter((l) => l.id !== id));
              toast.success("مورد با موفقیت حذف شد");
            }
          } catch (error) {
            console.error("Error deleting loan:", error);
          }
        },
        style: "destructive",
      },
    ]);
  };

  const handleEditLoan = (loan: Loan) => {
    router.navigate({
      pathname: "/loans/edit",
      params: { loan: JSON.stringify(loan) },
    });
  };

  const handleViewPayments = async (loan: Loan) => {
    setModalLoan(loan);
    setModalLoading(true);
    try {
      const payments = await getLoanPayments(loan.id);
      setModalPayments(payments);
    } catch (error) {
      console.error("Error loading payments:", error);
      toast.error("خطا در بارگذاری جزئیات پرداخت");
    } finally {
      setModalLoading(false);
    }
  };

  const formatAmount = (amount: number) => {
    return amount.toLocaleString("fa-IR");
  };

  const getRemaining = (loan: Loan) => {
    return loan.amount - loan.paid_amount;
  };

  const getProgress = (loan: Loan) => {
    if (loan.amount === 0) return 0;
    return (loan.paid_amount / loan.amount) * 100;
  };

  const isOverdue = (loan: Loan) => {
    const currentTime = new Date().getTime();
    const today = new Date(currentTime);
    today.setHours(0, 0, 0, 0);
    const endDateStr = loan.end_date.replace(/-/g, "/");
    const endDate = new Date(endDateStr);
    return endDate < today && !loan.is_settled;
  };

  return (
    <Mother style={styles.container} _Hpadding={0}>
      <Div style={styles.Header}>
        <Span type="title" style={styles.headerTitle}>
          مديريت وام و طلب
        </Span>

        <Spacer height={80} />

        <Div style={styles.headerButtons} />
      </Div>

      {/* View Mode Selector */}
      <Div style={styles.toggleContainer}>
        <Select
          label="نمایش"
          placeholder="نمایش"
          items_array={[
            { label: "تسویه نشده", value: "active" },
            { label: "تمام موارد", value: "all" },
            { label: "موارد تسویه شده", value: "settled" },
          ]}
          searchable={false}
          onValueChange={(value: string) =>
            setViewMode(value as "all" | "active" | "settled")
          }
          initialValue={viewMode}
        />
      </Div>

      <Spacer height={10} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {loans.map((loan) => (
          <TouchableOpacity
            key={loan.id}
            activeOpacity={0.8}
            style={styles.loanCard}
          >
            <Div style={styles.loanHeader}>
              <Div style={styles.loanTypeBadge}>
                <Span
                  type="default"
                  style={[
                    styles.typeBadgeText,
                    loan.type === "receivable"
                      ? styles.receivableBadge
                      : styles.payableBadge,
                  ]}
                >
                  {loan.type === "receivable" ? "طلبکار" : "بدهکار"}
                </Span>
              </Div>
              <Div style={styles.loanSource}>
                <Span type="subtitle" style={styles.sourceText}>
                  {loan.source}
                </Span>
              </Div>
            </Div>

            <Spacer height={10} />

            <Div style={styles.amountRow}>
              <Div style={styles.amountColumn}>
                <Span type="default" style={styles.amountLabel}>
                  مبلغ کل
                </Span>
                <Span type="subtitle" style={styles.amountValue}>
                  {formatAmount(loan.amount)}
                </Span>
              </Div>
              <Div style={styles.amountColumn}>
                <Span type="default" style={styles.amountLabel}>
                  پرداخت شده
                </Span>
                <Span
                  type="subtitle"
                  style={[
                    styles.amountValue,
                    loan.type === "receivable"
                      ? styles.incomeColor
                      : styles.spendingColor,
                  ]}
                >
                  {formatAmount(loan.paid_amount)}
                </Span>
              </Div>
              <Div style={styles.amountColumn}>
                <Span type="default" style={styles.amountLabel}>
                  مانده
                </Span>
                <Span
                  type="subtitle"
                  style={[
                    styles.amountValue,
                    getRemaining(loan) === 0
                      ? styles.settledColor
                      : loan.type === "receivable"
                        ? styles.incomeColor
                        : styles.spendingColor,
                  ]}
                >
                  {formatAmount(getRemaining(loan))}
                </Span>
              </Div>
            </Div>

            <Spacer height={10} />

            {/* Progress Bar */}
            <Div style={styles.progressContainer}>
              <Div
                style={[
                  styles.progressBar,
                  {
                    width: `${Math.min(getProgress(loan), 100)}%`,
                    backgroundColor:
                      getRemaining(loan) === 0
                        ? Colors[colorScheme].theGreen
                        : loan.type === "receivable"
                          ? "#2196F3"
                          : "#F44336",
                  },
                ]}
              />
            </Div>

            <Spacer height={10} />

            <Div style={styles.datesRow}>
              <Div style={styles.dateColumn}>
                <Span type="default" style={styles.dateLabel}>
                  تاریخ شروع
                </Span>
                <Span type="subtitle" style={styles.dateValue}>
                  {toJalali(loan.start_date)}
                </Span>
              </Div>
              <Div style={styles.dateColumn}>
                <Span type="default" style={styles.dateLabel}>
                  تاریخ سررسید/تسویه
                </Span>
                <Span
                  type="subtitle"
                  style={[
                    styles.dateValue,
                    isOverdue(loan) && !loan.is_settled
                      ? styles.overdueDate
                      : {},
                  ]}
                >
                  {loan.is_settled ? "تسویه شده" : toJalali(loan.end_date)}
                </Span>
              </Div>
            </Div>

            {loan.description && (
              <>
                <Spacer height={8} />
                <Div style={styles.descriptionContainer}>
                  <Span type="default" style={styles.descriptionLabel}>
                    توضیحات:
                  </Span>
                  <Span type="default" style={styles.descriptionText}>
                    {loan.description}
                  </Span>
                </Div>
              </>
            )}

            <Spacer height={10} />

            <Div style={styles.actionButtons}>
              <TouchableOpacity
                onPress={() => handleEditLoan(loan)}
                style={styles.iconButton}
              >
                <IconSymbol
                  type="Ionicons"
                  name="create-outline"
                  size={22}
                  color="#2196F3"
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleDeleteLoan(loan.id)}
                style={styles.iconButton}
              >
                <IconSymbol
                  type="Ionicons"
                  name="trash-outline"
                  size={22}
                  color="#F44336"
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleViewPayments(loan)}
                style={styles.iconButton}
              >
                <IconSymbol
                  type="Ionicons"
                  name="list-outline"
                  size={22}
                  color="#4CAF50"
                />
              </TouchableOpacity>
            </Div>
          </TouchableOpacity>
        ))}

        {loading && (
          <Div style={styles.loadingContainer}>
            <Span style={styles.loadingText}>در حال بارگذاری...</Span>
          </Div>
        )}

        {loans.length === 0 && !loading && (
          <Div style={styles.emptyContainer}>
            <IconSymbol
              type="MaterialIcons"
              name="account-balance-wallet"
              size={48}
              color={Colors[colorScheme].tabIconDefault}
            />
            <Spacer height={10} />
            <Span style={styles.emptyText}>
              {viewMode === "active"
                ? "بده بستونی نداری!"
                : "فعلا تسویه‌ای نداشتی!"}
            </Span>
          </Div>
        )}
      </ScrollView>

      {/* Payments Modal */}
      <Modal
        visible={!!modalLoan}
        animationType="slide"
        presentationStyle="pageSheet"
        backdropColor="rgba(0,0,0,0.05)"
        onRequestClose={() => setModalLoan(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContentWrapper}>
            <View style={styles.modalHeader}>
              <Span
                type="title"
                style={[styles.modalTitle, styles.modalTitleTruncated]}
                numberOfLines={1}
              >
                {modalLoan?.source}
              </Span>
              <TouchableOpacity
                onPress={() => setModalLoan(null)}
                style={styles.closeButton}
              >
                <Span style={styles.closeIcon}>✕</Span>
              </TouchableOpacity>
            </View>

            {modalLoading ? (
              <View style={styles.modalLoadingContainer}>
                <Span style={styles.loadingText}>در حال بارگذاری...</Span>
              </View>
            ) : (
              <ScrollView
                style={styles.modalScrollView}
                contentContainerStyle={{ paddingBottom: 50 }}
              >
                <Spacer height={10} />
                {modalPayments.length === 0 ? (
                  <Span style={styles.emptyPaymentsText} type="subtitle">
                    هیچ پرداختی ثبت نشده!
                  </Span>
                ) : (
                  modalPayments.map((payment) => (
                    <View key={payment.id} style={styles.paymentItem}>
                      <Div style={styles.paymentInfo}>
                        <Span
                          type="default"
                          style={[
                            styles.paymentType,
                            payment.type === "receipt"
                              ? styles.receiptType
                              : styles.paymentTypeColor,
                          ]}
                        >
                          {payment.type === "receipt" ? "دریافت" : "پرداخت"}
                        </Span>
                        <Span type="default" style={styles.paymentDate}>
                          {toJalali(payment.payment_date)}
                        </Span>
                      </Div>
                      <Span
                        type="subtitle"
                        style={[
                          styles.paymentAmount,
                          payment.type === "receipt"
                            ? styles.incomeColor
                            : styles.spendingColor,
                        ]}
                      >
                        {payment.type === "receipt" ? "+" : "-"}
                        {formatAmount(payment.amount)}
                      </Span>
                    </View>
                  ))
                )}
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </Mother>
  );
}

const styles = StyleSheet.create({
  container: {
    direction: "rtl",
    display: "flex",
    flex: 1,
  },
  Header: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 30,
    paddingTop: 18,
  },
  headerTitle: {
    height: "100%",
    verticalAlign: "middle",
    fontSize: 18,
  },
  headerButtons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  iconButton: {
    padding: 10,
  },
  toggleContainer: {
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  loanCard: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 15,
    padding: 20,
    marginVertical: 8,
  },
  loanHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  loanTypeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  typeBadgeText: {
    fontSize: 12,
    fontWeight: "bold",
  },
  receivableBadge: {
    color: "#2196F3",
    backgroundColor: "rgba(33, 150, 243, 0.15)",
  },
  payableBadge: {
    color: "#F44336",
    backgroundColor: "rgba(244, 67, 54, 0.15)",
  },
  loanSource: {
    flex: 1,
    marginHorizontal: 15,
  },
  sourceText: {
    fontSize: 16,
    fontWeight: "600",
  },
  amountRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  amountColumn: {
    alignItems: "center",
    flex: 1,
  },
  amountLabel: {
    fontSize: 11,
    color: "#888",
    marginBottom: 2,
  },
  amountValue: {
    fontSize: 14,
    fontWeight: "bold",
  },
  incomeColor: {
    color: "#4CAF50",
  },
  spendingColor: {
    color: "#F44336",
  },
  settledColor: {
    color: "#20fb8e",
  },
  progressContainer: {
    height: 6,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    borderRadius: 3,
  },
  datesRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
  },
  dateColumn: {
    alignItems: "center",
    flex: 1,
  },
  dateLabel: {
    fontSize: 11,
    color: "#888",
    marginBottom: 2,
  },
  dateValue: {
    fontSize: 13,
    fontWeight: "500",
  },
  overdueDate: {
    color: "#F44336",
  },
  descriptionContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 8,
    padding: 10,
  },
  descriptionLabel: {
    fontSize: 12,
    color: "#888",
    marginBottom: 2,
  },
  descriptionText: {
    fontSize: 13,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 15,
    marginTop: 10,
  },
  loadingContainer: {
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    fontSize: 16,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
    marginTop: 10,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContentWrapper: {
    backgroundColor: Colors.dark.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    width: "100%",
    maxHeight: "80%",
    position: "absolute",
    bottom: 0,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    flex: 1,
    paddingRight: 10,
  },
  modalTitleTruncated: {
    flex: 1,
    paddingRight: 10,
  },
  closeButton: {
    padding: 10,
  },
  closeIcon: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#888",
  },
  modalLoadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalScrollView: {
    padding: 20,
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    marginVertical: 5,
  },
  paymentsTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#888",
  },
  paymentItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.05)",
  },
  paymentInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  paymentType: {
    fontSize: 12,
    fontWeight: "600",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  receiptType: {
    color: "#4CAF50",
    backgroundColor: "rgba(76, 175, 80, 0.15)",
  },
  paymentTypeColor: {
    color: "#F44336",
    backgroundColor: "rgba(244, 67, 54, 0.15)",
  },
  paymentDate: {
    fontSize: 12,
    color: "#888",
  },
  paymentAmount: {
    fontSize: 14,
    fontWeight: "bold",
    direction: "ltr",
  },
  emptyPaymentsText: {
    textAlign: "center",
  },
});

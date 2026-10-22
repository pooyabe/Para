import { Div, IconSymbol, Mother, Spacer, Span } from "@/components/Elements";
import { Colors } from "@/constants/Colors";
import { useShamsiDate } from "@/hooks/BackEnd/useShamsiDate";
import { deleteLoan, getLoans } from "@/hooks/DB";
import { Loan } from "@/hooks/DB/actions/getLoans";
import { useColorScheme } from "@/hooks/useColorScheme";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { toast } from "sonner-native";

export default function LoansPage() {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [showAll, setShowAll] = useState<boolean>(false);

  const colorScheme = useColorScheme() as "light" | "dark";
  const { toJalali } = useShamsiDate();

  const loadLoans = useCallback(async () => {
    if (loading) return;
    setLoading(true);
    try {
      const loanList = await getLoans(showAll);
      setLoans(loanList);
    } catch (error) {
      console.error("Error loading loans:", error);
    } finally {
      setLoading(false);
    }
  }, [showAll, loading]);

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
    Alert.alert("حذف وام", "آیا می‌خواهید این وام را حذف کنید؟", [
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
              toast.success("وام با موفقیت حذف شد");
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
          مدیریت وام و طلب
        </Span>

        <Div style={styles.headerButtons}>
          {/* Settled Loans List Button */}
          <TouchableOpacity
            onPress={() => router.navigate("/loans/settled")}
            style={styles.iconButton}
          >
            <IconSymbol
              type="MaterialIcons"
              name="list-alt"
              size={24}
              color={Colors[colorScheme].text}
            />
          </TouchableOpacity>
        </Div>
      </Div>

      {/* Show All Toggle */}
      <Div style={styles.toggleContainer}>
        <TouchableOpacity
          onPress={() => setShowAll(!showAll)}
          style={[styles.toggleButton, showAll && styles.toggleButtonActive]}
        >
          <IconSymbol
            type="MaterialIcons"
            name={showAll ? "expand-less" : "expand-more"}
            size={18}
            color={
              showAll
                ? Colors[colorScheme].tabBackground
                : Colors[colorScheme].text
            }
          />
          <Span
            type="default"
            style={{
              fontSize: 12,
              color: showAll
                ? Colors[colorScheme].tabBackground
                : Colors[colorScheme].text,
              marginRight: 5,
            }}
          >
            {showAll ? "نمایش فقط فعال" : "نمایش همه (شامل تسویه شده)"}
          </Span>
        </TouchableOpacity>
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
              {showAll ? "هیچامی یافت نشد" : "هیچ وام فعالی یافت نشد"}
            </Span>
          </Div>
        )}
      </ScrollView>

      {/* Add Loan Button at bottom */}
      <TouchableOpacity
        onPress={() => router.navigate("/loans/add")}
        style={styles.fab}
      >
        <IconSymbol
          type="MaterialIcons"
          name="add"
          size={28}
          color={Colors[colorScheme].tabBackground}
        />
      </TouchableOpacity>
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
  addButton: {
    padding: 10,
  },
  iconButton: {
    padding: 10,
  },
  toggleContainer: {
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  toggleButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#2196F3",
    backgroundColor: "transparent",
  },
  toggleButtonActive: {
    backgroundColor: "#2196F3",
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
  fab: {
    position: "absolute",
    bottom: 30,
    right: 30,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#0a7ea4",
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
});

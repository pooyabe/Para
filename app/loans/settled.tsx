import {
  Div,
  IconSymbol,
  Mother,
  Spacer,
  Span,
} from "@/components/Elements";
import { Colors } from "@/constants/Colors";
import { useShamsiDate } from "@/hooks/BackEnd/useShamsiDate";
import { getSettledLoans, SettledLoan } from "@/hooks/DB";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useEffect, useState } from "react";
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { toast } from "sonner-native";

export default function SettledLoansPage() {
  const [settledLoans, setSettledLoans] = useState<SettledLoan[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [expandedLoan, setExpandedLoan] = useState<number | null>(null);

  const colorScheme = useColorScheme() as "light" | "dark";
  const { toJalali } = useShamsiDate();

  const loadSettledLoans = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const loans = await getSettledLoans();
      setSettledLoans(loans);
    } catch (error) {
      console.error("Error loading settled loans:", error);
      toast.error("خطا در بارگذاری وام‌های تسویه شده");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettledLoans();
  }, []);

  const formatAmount = (amount: number) => {
    return amount.toLocaleString("fa-IR");
  };

  const toggleExpand = (loanId: number) => {
    setExpandedLoan((prev) => (prev === loanId ? null : loanId));
  };

  return (
    <Mother style={styles.container} _Hpadding={0}>
      <Div style={styles.Header}>
        <Span type="title" style={styles.headerTitle}>
          وام‌های تسویه شده
        </Span>
      </Div>

      <Spacer height={10} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {settledLoans.map((loan) => {
          const isExpanded = expandedLoan === loan.id;
          const totalPaid = loan.payments.reduce(
            (sum, p) => sum + p.amount,
            0
          );

          return (
            <TouchableOpacity
              key={loan.id}
              onPress={() => toggleExpand(loan.id)}
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
                    {loan.type === "receivable" ? "بدهکار" : "بستانکار"}
                  </Span>
                </Div>
                <Div style={styles.loanSource}>
                  <Span type="subtitle" style={styles.sourceText}>
                    {loan.source}
                  </Span>
                </Div>
                <IconSymbol
                  type="Ionicons"
                  name={isExpanded ? "chevron-up-outline" : "chevron-down-outline"}
                  size={22}
                  color={Colors[colorScheme].tabIconDefault}
                />
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
                    کل پرداختی/دریافتی
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
                    {formatAmount(totalPaid)}
                  </Span>
                </Div>
                <Div style={styles.amountColumn}>
                  <Span type="default" style={styles.amountLabel}>
                    وضعیت
                  </Span>
                  <Span
                    type="subtitle"
                    style={[
                      styles.amountValue,
                      styles.settledColor,
                    ]}
                  >
                    تسویه شده
                  </Span>
                </Div>
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
                    تاریخ تسویه
                  </Span>
                  <Span type="subtitle" style={styles.dateValue}>
                    {toJalali(loan.end_date)}
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

              {/* Payment Details - Expandable */}
              {isExpanded && loan.payments.length > 0 && (
                <>
                  <Spacer height={15} />
                  <Div style={styles.divider} />
                  <Spacer height={10} />
                  <Span type="subtitle" style={styles.paymentsTitle}>
                    جزئیات پرداخت‌ها/دریافت‌ها
                  </Span>
                  <Spacer height={10} />
                  {loan.payments.map((payment, index) => (
                    <Div key={payment.id} style={styles.paymentItem}>
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
                    </Div>
                  ))}
                </>
              )}
            </TouchableOpacity>
          );
        })}

        {loading && (
          <Div style={styles.loadingContainer}>
            <Span style={styles.loadingText}>در حال بارگذاری...</Span>
          </Div>
        )}

        {settledLoans.length === 0 && !loading && (
          <Div style={styles.emptyContainer}>
            <IconSymbol
              type="MaterialIcons"
              name="check-circle-outline"
              size={48}
              color={Colors[colorScheme].tabIconDefault}
            />
            <Spacer height={10} />
            <Span style={styles.emptyText}>
              هیچ وام تسویه شده‌ای یافت نشد
            </Span>
          </Div>
        )}
      </ScrollView>
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
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  scrollContent: {
    paddingBottom: 30,
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
    paddingVertical: 8,
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
});
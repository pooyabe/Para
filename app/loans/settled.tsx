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
  const colors = Colors[colorScheme];
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
              style={[styles.loanCard, { backgroundColor: colors.card }]}
            >
              <Div style={styles.loanHeader}>
                <Div style={styles.loanTypeBadge}>
                  <Span
                    type="default"
                    style={[
                      styles.typeBadgeText,
                      {
                        color:
                          loan.type === "receivable"
                            ? colors.theLightBlue
                            : colors.theRed,
                        backgroundColor:
                          loan.type === "receivable"
                            ? colors.infoBackground
                            : colors.dangerBackground,
                      },
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
                  color={colors.muted}
                />
              </Div>

              <Spacer height={10} />

              <Div style={styles.amountRow}>
                <Div style={styles.amountColumn}>
                  <Span type="default" style={[styles.amountLabel, { color: colors.muted }]}>
                    مبلغ کل
                  </Span>
                  <Span type="subtitle" style={styles.amountValue}>
                    {formatAmount(loan.amount)}
                  </Span>
                </Div>
                <Div style={styles.amountColumn}>
                  <Span type="default" style={[styles.amountLabel, { color: colors.muted }]}>
                    کل پرداختی/دریافتی
                  </Span>
                  <Span
                    type="subtitle"
                    style={[
                      styles.amountValue,
                      {
                        color:
                          loan.type === "receivable"
                            ? colors.income
                            : colors.theRed,
                      },
                    ]}
                  >
                    {formatAmount(totalPaid)}
                  </Span>
                </Div>
                <Div style={styles.amountColumn}>
                  <Span type="default" style={[styles.amountLabel, { color: colors.muted }]}>
                    وضعیت
                  </Span>
                  <Span
                    type="subtitle"
                    style={[styles.amountValue, { color: colors.theGreen }]}
                  >
                    تسویه شده
                  </Span>
                </Div>
              </Div>

              <Spacer height={10} />

              <Div style={styles.datesRow}>
                <Div style={styles.dateColumn}>
                  <Span type="default" style={[styles.dateLabel, { color: colors.muted }]}>
                    تاریخ شروع
                  </Span>
                  <Span type="subtitle" style={styles.dateValue}>
                    {toJalali(loan.start_date)}
                  </Span>
                </Div>
                <Div style={styles.dateColumn}>
                  <Span type="default" style={[styles.dateLabel, { color: colors.muted }]}>
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
                  <Div style={[styles.descriptionContainer, { backgroundColor: colors.cardAlt }]}>
                    <Span type="default" style={[styles.descriptionLabel, { color: colors.muted }]}>
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
                  <Div style={[styles.divider, { backgroundColor: colors.divider }]} />
                  <Spacer height={10} />
                  <Span type="subtitle" style={styles.paymentsTitle}>
                    جزئیات پرداخت‌ها/دریافت‌ها
                  </Span>
                  <Spacer height={10} />
                  {loan.payments.map((payment, index) => (
                    <Div
                      key={payment.id}
                      style={[styles.paymentItem, { borderBottomColor: colors.divider }]}
                    >
                      <Div style={styles.paymentInfo}>
                        <Span
                          type="default"
                          style={[
                            styles.paymentType,
                            {
                              color:
                                payment.type === "receipt"
                                  ? colors.income
                                  : colors.theRed,
                              backgroundColor:
                                payment.type === "receipt"
                                  ? colors.successBackground
                                  : colors.dangerBackground,
                            },
                          ]}
                        >
                          {payment.type === "receipt" ? "دریافت" : "پرداخت"}
                        </Span>
                        <Span type="default" style={[styles.paymentDate, { color: colors.muted }]}>
                          {toJalali(payment.payment_date)}
                        </Span>
                      </Div>
                      <Span
                        type="subtitle"
                        style={[
                          styles.paymentAmount,
                          {
                            color:
                              payment.type === "receipt"
                                ? colors.income
                                : colors.theRed,
                          },
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
            <Span style={[styles.emptyText, { color: colors.muted }]}>
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
    marginBottom: 2,
  },
  amountValue: {
    fontSize: 14,
    fontWeight: "bold",
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
    marginBottom: 2,
  },
  dateValue: {
    fontSize: 13,
    fontWeight: "500",
  },
  descriptionContainer: {
    borderRadius: 8,
    padding: 10,
  },
  descriptionLabel: {
    fontSize: 12,
    marginBottom: 2,
  },
  descriptionText: {
    fontSize: 13,
  },
  divider: {
    height: 1,
    marginVertical: 5,
  },
  paymentsTitle: {
    fontSize: 14,
    fontWeight: "600",
  },
  paymentItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
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
  paymentDate: {
    fontSize: 12,
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
    textAlign: "center",
    marginTop: 10,
  },
});
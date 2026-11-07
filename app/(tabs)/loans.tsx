import {
  Div,
  IconSymbol,
  Mother,
  Select,
  Spacer,
  Span,
} from "@/components/Elements";
import { Colors } from "@/constants/Colors";
import { toPersianDigits } from "@/hooks/BackEnd/loanReminders/reminderTime";
import { useLoansList } from "@/hooks/BackEnd/Pages/useLoansList";
import { useShamsiDate } from "@/hooks/BackEnd/useShamsiDate";
import { Loan } from "@/hooks/DB/actions/getLoans";
import { useColorScheme } from "@/hooks/useColorScheme";
import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

export default function LoansPage() {
  const {
    loans,
    reminderCounts,
    loading,
    viewMode,
    setViewMode,
    modalLoan,
    modalPayments,
    modalLoading,
    removeLoan,
    openPayments,
    closePayments,
  } = useLoansList();

  const [helpVisible, setHelpVisible] = useState(false);

  const colorScheme = useColorScheme() as "light" | "dark";
  const colors = Colors[colorScheme];
  const { toJalali } = useShamsiDate();

  const handleDeleteLoan = (id: number) => {
    Alert.alert("حذف", "آیا می‌خواهید این مورد را حذف کنید؟", [
      {
        text: "لغو",
        onPress: () => {},
        style: "cancel",
      },
      {
        text: "حذف",
        onPress: () => removeLoan(id),
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

  const handleManageReminders = (loan: Loan) => {
    router.navigate({
      pathname: "/loans/reminders",
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
        <Div style={styles.titleGroup}>
          <IconSymbol
            type="Ionicons"
            name="wallet-outline"
            size={24}
            color={colors.tint}
          />
          <Span type="title" style={styles.headerTitle}>
            بده‌بستون
          </Span>
        </Div>
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel="راهنمای صفحه وام و طلب"
          onPress={() => setHelpVisible(true)}
          style={styles.helpButton}
        >
          <IconSymbol
            type="Ionicons"
            name="help-circle-outline"
            size={25}
            color={colors.tint}
          />
        </TouchableOpacity>
      </Div>

      <Spacer height={40} />

      {/* View Mode Selector */}
      <Div style={styles.toggleContainer}>
        <Select
          label="نمایش"
          placeholder="نمایش"
          items_array={[
            { label: "تسویه نشده‌ها", value: "active" },
            { label: "تسویه شده‌ها", value: "settled" },
            { label: "همه موارد", value: "all" },
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
                <Span
                  type="default"
                  style={[styles.amountLabel, { color: colors.muted }]}
                >
                  مبلغ کل
                </Span>
                <Span type="subtitle" style={styles.amountValue}>
                  {formatAmount(loan.amount)}
                </Span>
              </Div>
              <Div style={styles.amountColumn}>
                <Span
                  type="default"
                  style={[styles.amountLabel, { color: colors.muted }]}
                >
                  پرداخت شده
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
                  {formatAmount(loan.paid_amount)}
                </Span>
              </Div>
              <Div style={styles.amountColumn}>
                <Span
                  type="default"
                  style={[styles.amountLabel, { color: colors.muted }]}
                >
                  مانده
                </Span>
                <Span
                  type="subtitle"
                  style={[
                    styles.amountValue,
                    getRemaining(loan) === 0
                      ? { color: colors.theGreen }
                      : {
                          color:
                            loan.type === "receivable"
                              ? colors.income
                              : colors.theRed,
                        },
                  ]}
                >
                  {formatAmount(getRemaining(loan))}
                </Span>
              </Div>
            </Div>

            <Spacer height={10} />

            {/* Progress Bar */}
            <Div
              style={[
                styles.progressContainer,
                { backgroundColor: colors.card },
              ]}
            >
              <Div
                style={[
                  styles.progressBar,
                  {
                    width: `${Math.min(getProgress(loan), 100)}%`,
                    backgroundColor:
                      getRemaining(loan) === 0
                        ? colors.theGreen
                        : loan.type === "receivable"
                          ? colors.theLightBlue
                          : colors.theRed,
                  },
                ]}
              />
            </Div>

            <Spacer height={10} />

            <Div style={styles.datesRow}>
              <Div style={styles.dateColumn}>
                <Span
                  type="default"
                  style={[styles.dateLabel, { color: colors.muted }]}
                >
                  تاریخ شروع
                </Span>
                <Span type="subtitle" style={styles.dateValue}>
                  {toJalali(loan.start_date)}
                </Span>
              </Div>
              <Div style={styles.dateColumn}>
                <Span
                  type="default"
                  style={[styles.dateLabel, { color: colors.muted }]}
                >
                  تاریخ سررسید/تسویه
                </Span>
                <Span
                  type="subtitle"
                  style={[
                    styles.dateValue,
                    isOverdue(loan) && !loan.is_settled
                      ? { color: colors.theRed }
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
                <Div
                  style={[
                    styles.descriptionContainer,
                    { backgroundColor: colors.cardAlt },
                  ]}
                >
                  <Span
                    type="default"
                    style={[styles.descriptionLabel, { color: colors.muted }]}
                  >
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
                  color={colors.theLightBlue}
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
                  color={colors.theRed}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => openPayments(loan)}
                style={styles.iconButton}
              >
                <IconSymbol
                  type="Ionicons"
                  name="list-outline"
                  size={22}
                  color={colors.income}
                />
              </TouchableOpacity>
              <TouchableOpacity
                accessibilityRole="button"
                accessibilityLabel={`یادآوری‌های ${loan.source}`}
                onPress={() => handleManageReminders(loan)}
                style={styles.iconButton}
              >
                <IconSymbol
                  type="Ionicons"
                  name="notifications-outline"
                  size={22}
                  color={
                    reminderCounts[loan.id]
                      ? colors.theOrange
                      : colors.tabIconDefault
                  }
                />
                {!!reminderCounts[loan.id] && (
                  <Span
                    type="default"
                    style={[
                      styles.reminderBadge,
                      { backgroundColor: colors.theOrange },
                    ]}
                  >
                    {toPersianDigits(reminderCounts[loan.id])}
                  </Span>
                )}
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
              color={colors.tabIconDefault}
            />
            <Spacer height={10} />
            <Span style={[styles.emptyText, { color: colors.muted }]}>
              {viewMode === "active"
                ? "بده بستونی نداری!"
                : "فعلا تسویه‌ای نداشتی!"}
            </Span>
          </Div>
        )}
      </ScrollView>

      <TouchableOpacity
        accessibilityRole="button"
        accessibilityLabel="افزودن وام جدید"
        onPress={() => router.navigate("/loans/add")}
        style={[styles.addLoanButton, { backgroundColor: colors.theGreen }]}
      >
        <IconSymbol type="Ionicons" name="add" size={30} color="#FFFFFF" />
      </TouchableOpacity>

      {/* Loans help */}
      <Modal
        visible={helpVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setHelpVisible(false)}
      >
        <View
          style={[styles.modalOverlay, { backgroundColor: colors.overlay }]}
        >
          <View style={[styles.helpModal, { backgroundColor: colors.surface }]}>
            <Span type="title" style={styles.helpTitle}>
              راهنمای وام و طلب
            </Span>
            <Span
              style={{
                color: colors.text,
                lineHeight: 30,
                textAlign: "justify",
              }}
            >
              اینجا پول‌هایی رو که قرض دادی یا قرض گرفتی ثبت و پیگیری کن. مبلغ
              کل، پرداخت‌ها و مانده هر مورد رو می‌بینی و می‌تونی تاریخ سررسید و
              توضیحاتش رو مدیریت کنی. با دکمه زنگ روی هر مورد هم می‌تونی یادآور
              اعلان یک‌باره یا تکرارشونده تنظیم کنی.
            </Span>
            <TouchableOpacity
              onPress={() => setHelpVisible(false)}
              style={[
                styles.helpCloseButton,
                { backgroundColor: colors.theLightBlue },
              ]}
            >
              <Span>فهمیدم</Span>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Payments Modal */}
      <Modal
        visible={!!modalLoan}
        animationType="slide"
        presentationStyle="pageSheet"
        backdropColor="rgba(0,0,0,0.05)"
        onRequestClose={closePayments}
      >
        <View
          style={[styles.modalOverlay, { backgroundColor: colors.overlay }]}
        >
          <View
            style={[
              styles.modalContentWrapper,
              { backgroundColor: colors.background },
            ]}
          >
            <View
              style={[
                styles.modalHeader,
                { borderBottomColor: colors.divider },
              ]}
            >
              <Span
                type="title"
                style={[styles.modalTitle, styles.modalTitleTruncated]}
                numberOfLines={1}
              >
                {modalLoan?.source}
              </Span>
              <TouchableOpacity
                onPress={closePayments}
                style={styles.closeButton}
              >
                <Span style={[styles.closeIcon, { color: colors.muted }]}>
                  ✕
                </Span>
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
                    <View
                      key={payment.id}
                      style={[
                        styles.paymentItem,
                        { borderBottomColor: colors.divider },
                      ]}
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
                        <Span
                          type="default"
                          style={[styles.paymentDate, { color: colors.muted }]}
                        >
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
  titleGroup: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    columnGap: 10,
  },
  headerTitle: {
    flex: 1,
    verticalAlign: "middle",
    fontSize: 18,
  },
  helpButton: {
    padding: 6,
  },
  helpModal: {
    borderRadius: 18,
    padding: 20,
    width: "88%",
    rowGap: 14,
  },
  helpTitle: {
    fontSize: 20,
    textAlign: "right",
  },
  helpCloseButton: {
    alignSelf: "flex-start",
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 8,
  },
  headerButtons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  iconButton: {
    padding: 10,
  },
  reminderBadge: {
    position: "absolute",
    top: 2,
    right: 2,
    minWidth: 16,
    height: 16,
    paddingHorizontal: 3,
    borderRadius: 8,
    overflow: "hidden",
    fontSize: 10,
    lineHeight: 16,
    textAlign: "center",
    color: "#11181C",
  },
  toggleContainer: {
    paddingHorizontal: 20,
    paddingBottom: 10,
    direction: "ltr"
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  scrollContent: {
    paddingBottom: 100,
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
  progressContainer: {
    height: 6,
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
    textAlign: "center",
    marginTop: 10,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContentWrapper: {
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
    paddingVertical: 15,
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
    direction: "ltr",
  },
  emptyPaymentsText: {
    textAlign: "center",
  },

  // Add Loan Button
  addLoanButton: {
    position: "absolute",
    right: 24,
    bottom: 24,
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: "center",
    justifyContent: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    zIndex: 10,
  },
});

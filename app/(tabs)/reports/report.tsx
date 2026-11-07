import {
  Date,
  Div,
  GButton,
  IconSymbol,
  Mother,
  Spacer,
  Span,
} from "@/components/Elements";
import { router } from "expo-router";
import { ScrollView, StyleSheet, TouchableOpacity } from "react-native";

import { ImportanceDisplay } from "@/components/pageParts/reportsPage/ImportanceDisplay";
import { OveralLineChart } from "@/components/pageParts/reportsPage/OveralLineChart";
import { PieChartOne } from "@/components/pageParts/reportsPage/PieChartOne";
import { useMemo } from "react";

import { useReportData } from "@/hooks/BackEnd/Pages/useReportData";
import { type RangeType } from "@/hooks/BackEnd/useDateRange";

import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function ReportPage() {
  // spending pie chart colors
  const colorScheme = useColorScheme() as "light" | "dark";
  const colors = Colors[colorScheme];

  const SpendingPieColors = useMemo(() => {
    const pieColors: string[] = [];

    for (let index = 10; index > 0; index -= 1) {
      const tune = index !== 10 ? `${index}f` : `ff`;
      pieColors.push(Colors[colorScheme].theLightBlue + tune);
    }

    return pieColors;
  }, [colorScheme]);

  const {
    showLoading,
    selectedRange,
    customRange,
    showCustomDates,
    overalSpendingReport,
    overalIncomeReport,
    incomeDistribution,
    loanReport,
    percentageSpendingReport,
    importanceData,
    handleSelect,
    handleCustomDateChange,
  } = useReportData(SpendingPieColors);

  // This is an array of top select date buttons
  const theSelectDateButtons: { key: RangeType; label: string }[] = [
    { key: "month", label: "این ماه" },
    { key: "quarter", label: "سه ماهه" },
    { key: "sixmonth", label: "شش ماهه" },
    { key: "year", label: "یک ساله" },
    { key: "custom", label: "بازه دلخواه" },
  ];

  if (showLoading) {
    return (
      <Div
        style={[styles.LoadingScreen, { backgroundColor: colors.background }]}
      >
        <Span type="title" style={styles.LoadingScreenText}>
          لطفا صبر کنید...
        </Span>
      </Div>
    );
  } else
    return (
      <Mother style={styles.container} _Hpadding={0}>
        <Div style={styles.Header}>
          <Div style={styles.titleGroup}>
            <IconSymbol
              type="Ionicons"
              name="stats-chart-outline"
              size={24}
              color={colors.tint}
            />
            <Span type="title" style={styles.headerTitle}>
              گزارش وضعیت
            </Span>
          </Div>

          {/* Transactions list button */}
          <TouchableOpacity
            onPress={() => router.navigate("/reports/transactionsList")}
            style={{
              borderWidth: 2,
              borderRadius: 100,
              overflow: "hidden",
              display: "flex",
              flexDirection: "row",
              columnGap: 5,
              padding: 1,
              paddingRight: 7,
              paddingLeft: 7,
              justifyContent: "space-around",
              alignItems: "center",
              borderColor: Colors[colorScheme].theOrange,
            }}
          >
            <IconSymbol
              type="MaterialIcons"
              name="list-alt"
              size={15}
              color={Colors[colorScheme].text}
            />
            <Span
              type="default"
              style={{
                fontSize: 12,
                color: Colors[colorScheme].text,
              }}
            >
              تراکنش‌ها
            </Span>
          </TouchableOpacity>
        </Div>
        <Spacer height={30} />
        <Div style={styles.dateButtonGroup}>
          <ScrollView
            contentContainerStyle={styles.selectDateButtonsContainer}
            horizontal
            overScrollMode="always"
            fadingEdgeLength={20}
            showsHorizontalScrollIndicator={false}
            contentOffset={{ x: 1000, y: 0 }}
          >
            {theSelectDateButtons.map(({ key, label }) => (
              <GButton
                text={label}
                key={key}
                active={selectedRange === key}
                onPress={() => handleSelect(key)}
                style={styles.glassTopButtons}
              />
            ))}
          </ScrollView>
        </Div>
        {showCustomDates && (
          <Div style={styles.customDatesContainer}>
            <Div style={styles.customDateColumn}>
              <Span type="defaultMedium" style={styles.customDateLabel}>
                از
              </Span>
              <Date
                SelectedDate={customRange?.startDate}
                onDateChange={(date: string) => {
                  handleCustomDateChange("from", date);
                }}
                style={{}}
                todayMax
              />
            </Div>
            <Div style={styles.customDateColumn}>
              <Span type="defaultMedium" style={styles.customDateLabel}>
                تا
              </Span>
              <Date
                SelectedDate={customRange?.endDate}
                onDateChange={(date: string) => {
                  handleCustomDateChange("to", date);
                }}
                style={{}}
                minDate={customRange?.startDate}
                todayMax
              />
            </Div>
          </Div>
        )}
        <Spacer height={20} />
        <ScrollView
          style={styles.bottomSection}
          overScrollMode="always"
          fadingEdgeLength={80}
        >
          {/****
           *
           *
           * Import Chart Components from Comonents/PageParts/ReportPage
           *
           *
           **/}
          <OveralLineChart
            barData={overalSpendingReport}
            title="هزینه‌ها"
            color={Colors[colorScheme].theOrange}
          />

          <PieChartOne data={percentageSpendingReport} title="بیشتر چی خریدی" />

          <OveralLineChart
            barData={overalIncomeReport}
            title="درآمدها"
            color={Colors[colorScheme].income}
          />

          <PieChartOne data={incomeDistribution} title="درآمد از کجا بوده؟" />

          <Div
            style={[
              styles.loanSummary,
              { backgroundColor: colors.card, borderColor: colors.divider },
            ]}
          >
            <Span type="title" style={styles.loanSummaryTitle}>
              گزارش وام و طلب
            </Span>
            <Span style={[styles.loanSummaryHint, { color: colors.muted }]}>
              کل مبالغ و مانده‌ها برای همه وام‌هاست؛ دریافتی و پرداختی‌ها مربوط
              به بازه انتخاب‌شده است.
            </Span>
            <Div style={styles.loanSummaryRow}>
              <Div style={styles.loanSummaryItem}>
                <Span
                  style={[styles.loanSummaryLabel, { color: colors.muted }]}
                >
                  کل طلب ثبت‌شده
                </Span>
                <Span type="defaultSemiBold" style={{ color: colors.income }}>
                  {loanReport.receivableTotal.toLocaleString("fa-IR")}
                </Span>
              </Div>
              <Div style={styles.loanSummaryItem}>
                <Span
                  style={[styles.loanSummaryLabel, { color: colors.muted }]}
                >
                  کل بدهی ثبت‌شده
                </Span>
                <Span type="defaultSemiBold" style={{ color: colors.theRed }}>
                  {loanReport.payableTotal.toLocaleString("fa-IR")}
                </Span>
              </Div>
            </Div>
            <Div style={styles.loanSummaryRow}>
              <Div style={styles.loanSummaryItem}>
                <Span
                  style={[styles.loanSummaryLabel, { color: colors.muted }]}
                >
                  طلب باقی‌مانده
                </Span>
                <Span type="defaultSemiBold" style={{ color: colors.income }}>
                  {loanReport.receivableOutstanding.toLocaleString("fa-IR")}
                </Span>
              </Div>
              <Div style={styles.loanSummaryItem}>
                <Span
                  style={[styles.loanSummaryLabel, { color: colors.muted }]}
                >
                  بدهی باقی‌مانده
                </Span>
                <Span type="defaultSemiBold" style={{ color: colors.theRed }}>
                  {loanReport.payableOutstanding.toLocaleString("fa-IR")}
                </Span>
              </Div>
            </Div>
            <Div style={styles.loanSummaryRow}>
              <Div style={styles.loanSummaryItem}>
                <Span
                  style={[styles.loanSummaryLabel, { color: colors.muted }]}
                >
                  دریافت‌شده در این بازه
                </Span>
                <Span type="defaultSemiBold">
                  {loanReport.receivedInRange.toLocaleString("fa-IR")}
                </Span>
              </Div>
              <Div style={styles.loanSummaryItem}>
                <Span
                  style={[styles.loanSummaryLabel, { color: colors.muted }]}
                >
                  پرداخت‌شده در این بازه
                </Span>
                <Span type="defaultSemiBold">
                  {loanReport.paidInRange.toLocaleString("fa-IR")}
                </Span>
              </Div>
            </Div>
            <Span style={[styles.loanSummaryHint, { color: colors.muted }]}>
              وام‌های ثبت‌شده در این بازه: {loanReport.loanCountInRange}
            </Span>
          </Div>

          <ImportanceDisplay data={importanceData} />
        </ScrollView>
      </Mother>
    );
}

const styles = StyleSheet.create({
  container: {
    direction: "rtl",
    display: "flex",
  },

  // Header section
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
    height: "100%",
    verticalAlign: "middle",
    fontSize: 18,
  },

  selectDateButtonsContainer: {
    direction: "rtl",
    flexDirection: "row",
    columnGap: 20,
    alignItems: "center", // این خط خیلی مهمه
  },
  glassTopButtons: { paddingVertical: 5 },
  // Select date buttons
  dateButtonGroup: {
    paddingVertical: 10,
    paddingHorizontal: 10,
  },

  // Custom period date pickers (از / تا)
  customDatesContainer: {
    direction: "rtl",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    columnGap: 10,
    paddingHorizontal: 10,
  },
  customDateColumn: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    rowGap: 5,
  },
  customDateLabel: {
    fontSize: 14,
  },

  // The Bottom Section of data
  bottomSection: {
    flex: 1,
  },

  loanSummary: {
    borderWidth: 1,
    borderRadius: 14,
    marginHorizontal: 10,
    marginTop: 20,
    padding: 16,
    rowGap: 12,
  },
  loanSummaryTitle: {
    fontSize: 17,
    textAlign: "center",
  },
  loanSummaryHint: {
    fontSize: 12,
    lineHeight: 20,
    textAlign: "center",
  },
  loanSummaryRow: {
    flexDirection: "row",
    columnGap: 12,
  },
  loanSummaryItem: {
    flex: 1,
    rowGap: 4,
  },
  loanSummaryLabel: {
    fontSize: 12,
  },

  // Loading
  LoadingScreen: {
    width: "100%",
    height: "100%",
    position: "absolute",
    zIndex: 1000,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  LoadingScreenText: {
    fontSize: 30,
    textAlign: "center",
  },
});

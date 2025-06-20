import {
  Div,
  GButton,
  IconSymbol,
  Mother,
  Spacer,
  Span,
} from "@/components/Elements";
import { router } from "expo-router";
import { ScrollView, StyleSheet, TouchableOpacity } from "react-native";

import { OveralLineChart } from "@/components/pageParts/reportsPage/OveralLineChart";
import { SpendingsPieChart } from "@/components/pageParts/reportsPage/SpendingsPieChart";
import { useEffect, useState } from "react";

import { type RangeType } from "@/hooks/BackEnd/useDateRange";
import { getMonthlyReport } from "@/hooks/DB/reports/useMonthlyReport";

export default function ReportPage() {
  /**
   *
   * نمایش صفحه صبر
   *
   */
  const [showLoading, setShowLoading] = useState<boolean>(true);

  // This states set which date period button selected
  const [selectedRange, setSelectedRange] = useState<RangeType>("month");

  // This states hold the Overal top linechart data
  const [spendingReport, setSpendingReport] = useState<any[]>([]);

  // This is an array of top select date buttons
  const theSelectDateButtons: { key: RangeType; label: string }[] = [
    { key: "month", label: "این ماه" },
    { key: "quarter", label: "سه ماهه" },
    { key: "sixmonth", label: "شش ماهه" },
    { key: "year", label: "یک ساله" },
  ];

  const handleSelect = async (rangeKey: RangeType): Promise<void> => {
    setSelectedRange(rangeKey);

    fetchData(rangeKey);
  };

  /**
   *
   *
   * ارتباط با دیتابیس و گرفتن گزارشات
   *
   *
   */

  const fetchData = async (rangeKey: RangeType) => {
    // Show loading
    setShowLoading(true);

    // Get Spending data from DB
    const res = await getMonthlyReport('spendings', rangeKey);

    // Set the statement
    setSpendingReport(res);

    // Hide loading
    setShowLoading(false);
  };

  /**
   *
   * دریافت اطلاعات این ماه موقع بارگذاری صفحه
   *
   */
  useEffect(() => {
    fetchData("month");
  }, []);

  if (showLoading) {
    return (
      <Div style={styles.LoadingScreen}>
        <Span type="title" style={styles.LoadingScreenText}>
          لطفا صبر کنید...
        </Span>
      </Div>
    );
  } else
    return (
      <Mother style={styles.container} _Hpadding={0}>
        <Div style={styles.Header}>
          <Span type="title" style={styles.headerTitle}>
            گزارش وضعیت
          </Span>
          <TouchableOpacity
            onPress={() => {
              router.replace("/(tabs)/spending");
            }}
          >
            <IconSymbol type="Ionicons" name="home" size={24} color="white" />
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
          <OveralLineChart barData={spendingReport} title="هزینه‌ها" />

          <SpendingsPieChart />

          <Span type="subtitle" style={{ textAlign: "center", marginTop: 60 }}>
            چارت‌های دیگر به زودی...
          </Span>
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
    paddingTop: 30,
  },
  headerTitle: {
    height: "100%",
    verticalAlign: "middle",
    fontSize: 24,
  },

  selectDateButtonsContainer: {
    direction: "rtl",
    flexDirection: "row",
    columnGap: 20,
    alignItems: "center", // این خط خیلی مهمه
  },
  glassTopButtons: { paddingVertical: 10 },
  // Select date buttons
  dateButtonGroup: {
    paddingVertical: 10,
    paddingHorizontal: 30,
  },

  // The Bottom Section of data
  bottomSection: {
    flex: 1,
  },

  // Loading
  LoadingScreen: {
    width: "100%",
    height: "100%",
    backgroundColor: "#181f2f",
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

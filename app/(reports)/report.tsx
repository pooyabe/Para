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

import { ImportanceDisplay } from "@/components/pageParts/reportsPage/ImportanceDisplay";
import { OveralLineChart } from "@/components/pageParts/reportsPage/OveralLineChart";
import { PieChartOne } from "@/components/pageParts/reportsPage/PieChartOne";
import { useEffect, useState } from "react";

import { type RangeType } from "@/hooks/BackEnd/useDateRange";
import {
  getImportanceDistribution,
  type ImportanceData,
} from "@/hooks/DB/reports/useImportanceDistribution";
import { getMonthlyReport } from "@/hooks/DB/reports/useMonthlyReport";
import { getSpendingDistribution } from "@/hooks/DB/reports/useSpendingPercentage";

import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

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
  const [overalSpendingReport, setOveralSpendingReport] = useState<any[]>([]);

  // This state holds the spending items percentages
  const [percentageSpendingReport, setPercentageSpendingReport] = useState<
    any[]
  >([]);

  // This state holds the importance distribution data
  const [importanceData, setImportanceData] = useState<ImportanceData>({
    alkaaei: 0,
    borderline: 0,
    necessary: 0,
    total: 0,
  });

  // This is an array of top select date buttons
  const theSelectDateButtons: { key: RangeType; label: string }[] = [
    { key: "month", label: "این ماه" },
    { key: "quarter", label: "سه ماهه" },
    { key: "sixmonth", label: "شش ماهه" },
    { key: "year", label: "یک ساله" },
  ];

  /**
   *
   * set Colros
   *
   */

  // spending pie chart
  const colorScheme = useColorScheme() as "light" | "dark";

  let SpendingPieColors: string[] = [];
  for (var i: number = 10; i > 0; i--) {
    const tune = i != 10 ? `${i}f` : `ff`;
    SpendingPieColors.push(Colors[colorScheme].theLightBlue + tune);
  }

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

    // Get Overal Spending data from DB
    const osr = await getMonthlyReport("spendings", rangeKey);
    setOveralSpendingReport(osr);

    // Get percentage spending report
    const psr = await getSpendingDistribution(rangeKey, SpendingPieColors);
    setPercentageSpendingReport(psr);

    // Get importance distribution data
    const impData = await getImportanceDistribution(rangeKey);
    setImportanceData(impData);

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

          {/* Transactions List Button */}
          <TouchableOpacity
            onPress={() => {
              router.push("/(reports)/transactionsList");
            }}
          >
            <IconSymbol
              type="MaterialIcons"
              name="list-alt"
              size={20}
              color="white"
            />
          </TouchableOpacity>

          {/* Top Home Icon */}
          <TouchableOpacity
            onPress={() => {
              router.replace("/(tabs)/spending");
            }}
          >
            <IconSymbol type="Ionicons" name="home" size={20} color="white" />
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
          <OveralLineChart
            barData={overalSpendingReport}
            title="هزینه‌ها"
            color={Colors[colorScheme].theOrange}
          />

          <PieChartOne data={percentageSpendingReport} title="بیشتر چی خریدی" />

          <ImportanceDisplay data={importanceData} />

          {/* <Span type="subtitle" style={{ textAlign: "center", marginTop: 60 }}>
            چارت و اطلاعات دیگه هم تو راهه...
          </Span> */}
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

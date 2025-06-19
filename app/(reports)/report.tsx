import {
  Div,
  GButton,
  IconSymbol,
  Mother,
  Spacer,
  Span,
} from "@/components/Elements";
import { router } from "expo-router";
import { useState } from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import { useThemeColor } from "@/hooks/useThemeColor";

import { OveralLineChart } from "@/components/pageParts/reportsPage/OveralLineChart";
import { PieChart } from "react-native-gifted-charts";

// Get Screen Dimensions
const screenHeight = Dimensions.get("screen").height;
const screenWidth = Dimensions.get("window").width;

export default function ReportPage() {
  // This states set which date period button selected
  const [selectedDatePeriodButton, setSelectedDatePeriodButton] =
    useState<string>("month");
  // This is an array of top select date buttons
  const theSelectDateButtons = [
    { key: "month", label: "این ماه" },
    { key: "quarter", label: "سه ماهه" },
    { key: "year", label: "یک ساله" },
    { key: "custom", label: "تاریخ دلخواه" },
  ];

  /**
   *
   * Get the Colors
   *
   */
  const theBGColor = useThemeColor({}, "background");
  const theTextColor = useThemeColor({}, "text");
  const theLightBlue = useThemeColor({}, "theLightBlue");
  const theTintColor = useThemeColor({}, "tint");
  const theTabBgColor = useThemeColor({}, "tabBackground");
  const theGreenColor = useThemeColor({}, "theGreen");
  const theOrangeColor = useThemeColor({}, "theOrange");

  const pieData = [
    { value: 20, text: "کرایه خانه", color: "#118cfeff" },
    { value: 15, text: "رستوران", color: "#118cfe9f" },
    { value: 14, text: "غذای سازمان", color: "#118cfe8f" },
    { value: 11.2, text: "حمل و نقل", color: "#118cfe7f" },
    { value: 10, text: "بدهی", color: "#118cfe6f" },
    { value: 9, text: "لباس", color: "#118cfe5f" },
    { value: 7, text: "اینترنت", color: "#118cfe4f" },
    { value: 6.8, text: "کافه", color: "#118cfe3f" },
    { value: 4, text: "متفرقه", color: "#118cfe2f" },
  ];

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
              active={selectedDatePeriodButton === key}
              onPress={() => setSelectedDatePeriodButton(key)}
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
        <OveralLineChart />
        
        <Div
          style={[styles.chartWithBG, styles.singleChart, { direction: "rtl" }]}
        >
          <Span type="title" style={styles.chartTitle}>
            بیشتر چی خریدی؟
          </Span>
          <PieChart
            strokeColor="#232d3c"
            strokeWidth={2}
            donut
            data={pieData}
            innerCircleColor="#232d3c"
            innerCircleBorderWidth={0}
            innerRadius={70}
            innerCircleBorderColor={theTintColor}
            labelsPosition="onBorder"
            textSize={11}
            textColor={theBGColor}
            inwardExtraLengthForFocused={50}
            tooltipDuration={1500}
            showValuesAsTooltipText
            showTooltip
            tooltipBackgroundColor={theTintColor}
            tooltipWidth={100}
            tooltipComponent={(item: number) => (
              <Span
                style={[
                  styles.tooltipStyle,
                  { backgroundColor: theTintColor, color: theBGColor },
                ]}
                type="default"
              >
                {pieData[item].text}
                {"\n"}
                {pieData[item].value}%
              </Span>
            )}
          />

          <Div style={styles.dataLegendContainer}>
            {pieData.map((item, index) => (
              <Div style={styles.dataLegendItem} key={index}>
                <Span
                  style={[
                    styles.dataLegendIndicator,
                    {
                      backgroundColor: item.color || "white",
                    },
                  ]}
                >
                  {item.value}%
                </Span>

                <Span style={styles.dataLegendLabel} type="default">
                  {item.text || ""}
                </Span>
              </Div>
            ))}
          </Div>
        </Div>
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

  // Select date buttons
  dateButtonGroup: {
    paddingVertical: 10,
    paddingHorizontal: 30,
  },
  selectDateButtonsContainer: {
    direction: "rtl",
    flexDirection: "row",
    columnGap: 20,
    alignItems: "center", // این خط خیلی مهمه
  },
  glassTopButtons: { paddingVertical: 10 },

  // The Bottom Section of data
  bottomSection: {
    flex: 1,
  },

  // Charts
  singleChart: {
    alignItems: "center",
    direction: "ltr",
    paddingTop: 20,
    paddingBottom: 20,
  },
  chartTitle: {
    marginBottom: 20,
    fontSize: 20,
  },

  chartWithBG: {
    backgroundColor: "#c9fbff11",
    borderRadius: 0,
    borderBottomWidth: 0,
  },

  /**
   *
   * Pie chart section
   *
   */
  tooltipStyle: {
    padding: 10,
    borderRadius: 10,
    textAlign: "center",
    lineHeight: 30,
    opacity: 0.9,
  },
  dataLegendContainer: {
    marginTop: 10,
    display: "flex",
    flexDirection: "row",
    width: screenWidth,
    flexWrap: "wrap",
    justifyContent: "center",
    rowGap: 20,
  },
  dataLegendItem: {
    flexDirection: "row",
    width: screenWidth * 0.33,
    alignItems: "center",
    flexWrap: "wrap",
  },
  dataLegendIndicator: {
    marginRight: 10,
    borderRadius: 4,
    padding: 2,
    width: 40,
    textAlign: "center",
  },
  dataLegendLabel: {
    fontSize: 16,
    marginRight: 2,
  },
});

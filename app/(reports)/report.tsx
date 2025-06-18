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

import { LineChart, PieChartPro } from "react-native-gifted-charts";
import { LinearGradient, Stop } from "react-native-svg";

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
  const theTintColor = useThemeColor({}, "tint");
  const theTabBgColor = useThemeColor({}, "tabBackground");

  const data = [
    { value: 15 },

    { value: 10 },

    { value: 8 },

    { value: 58 },

    { value: 56 },

    { value: 78 },

    { value: 24 },

    { value: 28 },
  ];

  const data2 = [
    { value: 40 },

    { value: 20 },

    { value: 18 },

    { value: 40 },

    { value: 36 },

    { value: 60 },

    { value: 4 },

    { value: 45 },
  ];

  const pieData = [
    { value: 54, color: "#177AD5" },

    { value: 40, color: "#79D2DE" },

    { value: 20, color: "#ED6665" },
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
        <Div style={styles.singleChart}>
          <LineChart
            data={data}
            data2={data2}
            height={screenHeight * 0.35}
            curved
            spacing={50}
            width={screenWidth * 0.85}
            hideDataPoints
            lineGradient
            lineGradientId="ggrd" // same as the id passed in <LinearGradient> below
            lineGradientComponent={() => {
              return (
                <LinearGradient id="ggrd" x1="0" y1="0" x2="0" y2="1">
                  <Stop offset="0" stopColor={"blue"} />

                  <Stop offset="0.5" stopColor={"orange"} />

                  <Stop offset="1" stopColor={"green"} />
                </LinearGradient>
              );
            }}
          />
        </Div>
        <Div style={styles.singleChart}>
          <PieChartPro
            donut
            isThreeD
            showText
            textColor="black"
            radius={170}
            textSize={20}
            showTextBackground
            textBackgroundRadius={26}
            data={pieData}
          />
        </Div>
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
    direction: "ltr"
  },
});

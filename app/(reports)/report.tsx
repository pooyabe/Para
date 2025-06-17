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
        fadingEdgeLength={100}
      >
        <Div style={styles.chart1}>
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
  chart1: {},
});

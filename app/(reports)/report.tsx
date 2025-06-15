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
import { ScrollView, StyleSheet, TouchableOpacity } from "react-native";

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

  return (
    <Mother style={styles.container}>
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
      <ScrollView
        contentContainerStyle={styles.selectDateButtonsContainer}
        horizontal
        overScrollMode="always"
        showsHorizontalScrollIndicator={true}
        fadingEdgeLength={20}
      >
        {theSelectDateButtons.map(({ key, label }) => (
          <GButton
            text={label}
            key={key}
            active={selectedDatePeriodButton === key}
            onPress={() => setSelectedDatePeriodButton(key)}
          />
        ))}
      </ScrollView>
    </Mother>
  );
}

const styles = StyleSheet.create({
  container: {
    direction: "rtl",
  },

  // Header section
  Header: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 40,
  },
  headerTitle: {
    height: "100%",
    verticalAlign: "middle",
    fontSize: 24,
  },

  // Select date buttons
  selectDateButtonsContainer: {
    direction: "rtl",
    display: "flex",
    flexDirection: "row",
    columnGap: 10,
    height: 40,
  },
});

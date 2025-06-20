import { GButton } from "@/components/Elements";
import { useState } from "react";
import { ScrollView, StyleSheet } from "react-native";

export function TopDateButtons() {
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
  );
}

const styles = StyleSheet.create({
  selectDateButtonsContainer: {
    direction: "rtl",
    flexDirection: "row",
    columnGap: 20,
    alignItems: "center", // این خط خیلی مهمه
  },
  glassTopButtons: { paddingVertical: 10 },
});

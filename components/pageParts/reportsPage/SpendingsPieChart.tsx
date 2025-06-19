import { Div, Span } from "@/components/Elements";
import { Dimensions, StyleSheet } from "react-native";

import { useThemeColor } from "@/hooks/useThemeColor";

import { PieChart } from "react-native-gifted-charts";

// Get Screen Dimensions
const screenWidth = Dimensions.get("window").width;

export function SpendingsPieChart() {
  /**
   *
   * Get the Colors
   *
   */
  const theBGColor = useThemeColor({}, "background");
  const theTintColor = useThemeColor({}, "tint");

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
    <Div style={[styles.chartWithBG, styles.singleChart, { direction: "rtl" }]}>
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
  );
}

const styles = StyleSheet.create({
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

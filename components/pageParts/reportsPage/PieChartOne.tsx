import { Div, Span } from "@/components/Elements";
import { Dimensions, StyleSheet } from "react-native";

import { useThemeColor } from "@/hooks/useThemeColor";

import { PieChart, PieChartPropsType } from "react-native-gifted-charts";

// Get Screen Dimensions
const screenWidth = Dimensions.get("window").width;

type pieChartOneType = PieChartPropsType & {
  data: Array<{ value: number; text: string; color: string }>;
  title?: string;
};

export function PieChartOne({
  data,
  title = "نمودار دایره‌ای",
}: pieChartOneType) {
  /**
   *
   * Get the Colors
   *
   */
  const theBGColor = useThemeColor({}, "background");
  const theTintColor = useThemeColor({}, "tint");

  return (
    <Div style={[styles.chartWithBG, styles.singleChart, { direction: "rtl" }]}>
      <Span type="title" style={styles.chartTitle}>
        {title}
      </Span>
      <PieChart
        strokeColor="#232d3c"
        strokeWidth={2}
        donut
        data={data}
        innerCircleColor="#232d3c"
        innerCircleBorderWidth={0}
        innerRadius={80}
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
            {data[item].text}
            {"\n"}
            {data[item].value}%
          </Span>
        )}
      />

      <Div style={styles.dataLegendContainer}>
        {data.map((item, index) => (
          <Div style={styles.dataLegendItem} key={index}>
            <Span
              style={[
                styles.dataLegendIndicator,
                {
                  backgroundColor: item.color || "white",
                  fontSize: 12,
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
    fontSize: 16,
    marginBottom: 20,
  },

  chartWithBG: {
    backgroundColor: "#c9fbff11",
    borderRadius: 12,
    borderRightWidth: 4,
    width: screenWidth * 0.95,
    marginTop: 20,
    alignSelf: "center",
    borderColor: "#118dff",
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
    lineHeight: 20,
    opacity: 0.9,
    fontSize: 12,
  },
  dataLegendContainer: {
    marginTop: 20,
    display: "flex",
    flexDirection: "row",
    width: screenWidth,
    flexWrap: "wrap",
    justifyContent: "center",
    rowGap: 20,
    paddingHorizontal: 2,
  },
  dataLegendItem: {
    flexDirection: "row",
    width: screenWidth * 0.3,
    alignItems: "center",
    flexWrap: "wrap",
  },
  dataLegendIndicator: {
    marginRight: 10,
    borderRadius: 4,
    padding: 2,
    width: 45,
    textAlign: "center",
  },
  dataLegendLabel: {
    fontSize: 12,
    marginRight: 4,
  },
});

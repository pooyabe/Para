import { Div, IconSymbol, Span } from "@/components/Elements";
import { Dimensions, StyleSheet, TouchableOpacity } from "react-native";

import { useThemeColor } from "@/hooks/useThemeColor";

import { useState } from "react";
import { BarChart, BarChartPropsType } from "react-native-gifted-charts";

// Get Screen Dimensions
const screenHeight = Dimensions.get("screen").height;
const screenWidth = Dimensions.get("window").width;

type OverChartProps = BarChartPropsType & {
  barData?: Array<{ value: number; label: string }>;
  title: string;
  color?: string;
};

export function OveralLineChart({
  barData = [{ value: 0, label: "01-01" }],
  title = "عنوان",
  color = "#ec6665",
}: OverChartProps) {
  /**
   *
   * Get the Colors
   *
   */
  const theTextColor = useThemeColor({}, "text");
  const theLightBlue = useThemeColor({}, "theLightBlue");
  const theGreenColor = useThemeColor({}, "theGreen");
  const theOrangeColor = useThemeColor({}, "theOrange");

  /** Zoom in-out the linear chart by changing the spacing constant */
  const [chartZoomConstant, setChartZoomConstant] = useState<number>(
    (screenWidth * 0.5) / (barData.length + 1)
  );
  const changeChartZoom = (theLeveler: number): void => {
    // if leveler = 2 : reset the zoom
    if (theLeveler == 2) {
      setChartZoomConstant(screenWidth / (barData.length - 1));
      return;
    }
    // The Leveler is +1 or -1
    const the_new_spacing_constant = chartZoomConstant + theLeveler * 4;
    setChartZoomConstant(the_new_spacing_constant);
  };

  return (
    <Div style={styles.singleChart}>
      <Span type="title" style={styles.chartTitle}>
        دخل و خرج
      </Span>
      <Div
        style={{
          display: "flex",
          flexDirection: "row",
          alignSelf: "flex-start",
          marginRight: 10,
          marginLeft: 10,
          justifyContent: "space-between",
          width: 100,
        }}
      >
        <TouchableOpacity onPress={() => changeChartZoom(+1)}>
          <IconSymbol name="zoom-in" size={30} color={theTextColor} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => changeChartZoom(2)}>
          <IconSymbol name="zoom-in-map" size={30} color={theTextColor} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => changeChartZoom(-1)}>
          <IconSymbol name="zoom-out" size={30} color={theTextColor} />
        </TouchableOpacity>
      </Div>
      <BarChart
        data={barData}
        barWidth={10}
        spacing={chartZoomConstant}
        roundedTop
        roundedBottom
        hideRules
        xAxisThickness={5}
        yAxisThickness={5}
        yAxisTextStyle={{ color: theGreenColor }}
        frontColor={color}
        xAxisLabelTextStyle={{
          color: color,
        }}
        xAxisColor={theLightBlue}
        yAxisColor={theLightBlue}
      />
      <Span
        style={{
          display: "flex",
          flexDirection: "row",
          gap: "10",
          marginTop: 30,
          opacity: 0.5,
          alignSelf: "flex-end",
          marginRight: 10,
          marginLeft: 10,
        }}
      >
        <IconSymbol
          type="Ionicons"
          name="hand-right"
          size={18}
          color={theTextColor}
        />
        <IconSymbol
          type="Ionicons"
          name="swap-horizontal-outline"
          size={18}
          color={theTextColor}
        />
      </Span>
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
});

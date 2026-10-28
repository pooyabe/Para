import { Div, IconSymbol, Span } from "@/components/Elements";
import { Dimensions, StyleSheet, TouchableOpacity } from "react-native";

import { useThemeColor } from "@/hooks/useThemeColor";

import numberToText from "@/hooks/numberToText";
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
  color,
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
  const theTintColor = useThemeColor({}, "tint");
  const theMutedColor = useThemeColor({}, "muted");

  // Fall back to the app accent color when no bar color is provided.
  const barColor = color ?? theLightBlue;

  /** Zoom in-out the linear chart by changing the spacing constant */
  const [chartZoomConstant, setChartZoomConstant] = useState<number>(
    (screenWidth * 0.5) / (barData.length + 1),
  );
  const [barWidth, setBarWidth] = useState<number>(12);
  const changeChartZoom = (theLeveler: number): void => {
    // if leveler = 2 : reset the zoom
    if (theLeveler == 2) {
      setChartZoomConstant((screenWidth * 0.5) / (barData.length + 1));
      setBarWidth(12);
      return;
    }
    // The Leveler is +1 or -1
    const the_new_spacing_constant = chartZoomConstant + theLeveler * 10;
    const the_new_bar_width = barWidth + theLeveler * 2;

    if (barWidth <= 20 && barWidth >= 7) {
      setChartZoomConstant(the_new_spacing_constant);
      setBarWidth(the_new_bar_width);
    }
  };

  /**
   *
   * نمایش رقم به متن در بالای چارت
   *
   */
  const [chartValueHelper, setChartValueHelper] = useState<string>("");
  const handleChangeValueHelper = (value: string) => {
    setChartValueHelper(numberToText(Number(value)));
  };
  return (
    <Div style={styles.singleChart}>
      <Span type="title" style={styles.chartTitle}>
        {title}
      </Span>
      <Div
        style={{
          display: "flex",
          flexDirection: "row",
          alignSelf: "flex-start",
          paddingRight: 10,
          paddingLeft: 10,
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <Div
          style={{
            display: "flex",
            flexDirection: "row",
            alignSelf: "flex-start",
            justifyContent: "space-between",
            columnGap: 5,
          }}
        >
          <TouchableOpacity onPress={() => changeChartZoom(+1)}>
            <IconSymbol name="zoom-in" size={22} color={theTextColor} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => changeChartZoom(2)}>
            <IconSymbol name="zoom-out-map" size={22} color={theTextColor} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => changeChartZoom(-1)}>
            <IconSymbol name="zoom-out" size={22} color={theTextColor} />
          </TouchableOpacity>
        </Div>
        <Span
          style={{
            alignSelf: "center",
            color: theTextColor,
          }}
        >
          {chartValueHelper}
        </Span>
      </Div>
      <BarChart
        data={barData}
        // style
        barWidth={barWidth}
        spacing={chartZoomConstant}
        roundedTop
        frontColor={barColor}
        width={screenWidth * 0.93}
        hideOrigin
        // Press
        focusBarOnPress
        onPress={(data: any) => handleChangeValueHelper(data.value)}
        focusedBarConfig={{
          color: theGreenColor,
        }}
        //X Axis
        xAxisThickness={1}
        xAxisColor={theMutedColor}
        xAxisLabelTextStyle={{
          color: theMutedColor,
          fontFamily: "VazirRegular",
          direction: "rtl",
          fontSize: 10,
        }}
        // Y Axis
        yAxisThickness={0}
        yAxisTextStyle={{
          color: theTextColor,
          fontFamily: "VazirRegular",
          direction: "rtl",
          fontSize: 10,
        }}
        yAxisExtraHeight={20}
        yAxisLabelContainerStyle={{
          justifyContent: "flex-start",
          width: "auto",
        }}
        // Rules
        noOfSections={5}
        rulesType="dashed"
        rulesThickness={1}
        rulesColor={`${theOrangeColor}2f`}
      />
      <Span
        style={{
          display: "flex",
          flexDirection: "row",
          gap: "10",
          marginTop: 0,
          opacity: 0.5,
          alignSelf: "flex-end",
          marginRight: 10,
          marginLeft: 10,
        }}
      >
        <IconSymbol
          type="Ionicons"
          name="hand-right"
          size={12}
          color={theTextColor}
        />
        <IconSymbol
          type="Ionicons"
          name="swap-horizontal-outline"
          size={12}
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
    paddingHorizontal: 10,
  },
  chartTitle: {
    fontSize: 16,
  },
});

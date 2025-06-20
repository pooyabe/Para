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
  color = "#118cfe",
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

  /** Zoom in-out the linear chart by changing the spacing constant */
  const [chartZoomConstant, setChartZoomConstant] = useState<number>(
    (screenWidth * 0.5) / (barData.length + 1)
  );
  const changeChartZoom = (theLeveler: number): void => {
    // if leveler = 2 : reset the zoom
    if (theLeveler == 2) {
      setChartZoomConstant(screenWidth / barData.length);
      return;
    }
    // The Leveler is +1 or -1
    const the_new_spacing_constant = chartZoomConstant + theLeveler * 10;
    setChartZoomConstant(the_new_spacing_constant);
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
          }}
        >
          <TouchableOpacity onPress={() => changeChartZoom(+1)}>
            <IconSymbol name="zoom-in" size={30} color={theTextColor} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => changeChartZoom(2)}>
            <IconSymbol name="zoom-out-map" size={30} color={theTextColor} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => changeChartZoom(-1)}>
            <IconSymbol name="zoom-out" size={30} color={theTextColor} />
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
        barWidth={20}
        spacing={chartZoomConstant}
        roundedTop
        roundedBottom
        frontColor={color}
        width={screenWidth}
        hideOrigin
        focusBarOnPress
        //X Axis
        xAxisThickness={0}
        xAxisLabelTextStyle={{
          color: "gray",
        }}
        rotateLabel
        // Y Axis
        yAxisThickness={0}
        yAxisTextStyle={{ color: theTextColor }}
        yAxisExtraHeight={50}
        yAxisLabelContainerStyle={{
          justifyContent: "flex-start",
          width: "auto",
        }}
        rulesThickness={1}
        rulesColor="rgba(200,200,200,0.2)"
        onPress={(data:any) => handleChangeValueHelper(data.value)}
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

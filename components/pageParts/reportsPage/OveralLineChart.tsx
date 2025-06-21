import { Div, IconSymbol, Span } from "@/components/Elements";
import { Dimensions, StyleSheet, TouchableOpacity } from "react-native";

import { useThemeColor } from "@/hooks/useThemeColor";

import { useState } from "react";
import { LineChart, LineChartPropsType } from "react-native-gifted-charts";

// Get Screen Dimensions
const screenHeight = Dimensions.get("screen").height;
const screenWidth = Dimensions.get("window").width;

type OverChartProps = LineChartPropsType & {
  spendingData?: Array<{ value: number; label: string }>;
  incomeData?: Array<{ value: number }>;
};

export function OveralLineChart({
  spendingData = [{ value: 0, label: "01-01" }],
  incomeData = [{ value: 0 }],
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
  const [chartZoomConstant, setChartZoomConstant] = useState<number>(0.8);
  const changeChartZoom = (theLeveler: number): void => {
    // if leveler = 2 : reset the zoom
    if (theLeveler == 2) {
      setChartZoomConstant(0.8);
      return;
    }
    // The Leveler is +1 or -1
    const the_new_spacing_constant = chartZoomConstant + theLeveler * 0.2;
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
      <LineChart
        data={spendingData}
        curved
        hideDataPoints
        /**
         *
         * این عدد مربوط به فاصله بین نقاط روی محور ایکس از کجا اومده؟
         * خب. ما یک دهم فاصله از سمت راست خالی میذاریم.
         * یک دهم هم برای اعداد محور.
         * یک دهم هم برای فاصله اولیه یا همون initialSpacing
         * پس مقدار سه دهم از کل طول صفحه کسر میشه.
         * اون رو تقسیم بر تعداد دیتاها منهای یک میکنیم. یعنی تقسیم بر تعداد فواصل
         * موجود بین دیتاها. به این صورت تعداد دیتا هر چقدر باشه، داخل
         * نمودار در طول صفحه جا میشه.
         *
         */
        spacing={(screenWidth * chartZoomConstant) / (spendingData.length - 1)}
        initialSpacing={screenWidth * 0.07}
        endSpacing={screenWidth * 0.05}
        height={screenHeight * 0.2}
        width={screenWidth * 0.82}
        /**
         * تنظیمات محور x
         */
        xAxisThickness={0}
        xAxisLabelTextStyle={{
          color: theGreenColor,
          fontFamily: "VazirRegular",
        }}
        showXAxisIndices={true}
        xAxisIndicesColor={theGreenColor}
        xAxisIndicesHeight={5}
        xAxisIndicesWidth={2}
        /**
         * تنظیمات محور y
         */
        color={theLightBlue}
        yAxisTextStyle={{
          color: theLightBlue,
          fontFamily: "VazirRegular",
        }}
        yAxisExtraHeight={50}
        yAxisThickness={0}
        rulesThickness={2}
        rulesType="dashed"
        rulesColor="#c9fbff16"
        noOfSections={5}
        thickness={4}
        /**
         * دیتای دوم
         */
        secondaryData={incomeData}
        secondaryLineConfig={{
          color: theOrangeColor,
        }}
        secondaryYAxis={{
          noOfSections: 5,
          showFractionalValues: true,
          roundToDigits: 0,
          yAxisTextStyle: {
            color: theOrangeColor,
          },
        }}
        /**
         * Focus
         */
        focusEnabled
        showDataPointLabelOnFocus
        showStripOnFocus
        delayBeforeUnFocus={1000}
        isAnimated
        animationDuration={1500}
        animateTogether={true}
        animationEasing
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

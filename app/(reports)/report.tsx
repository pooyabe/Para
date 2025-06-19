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

import { LineChart, PieChart } from "react-native-gifted-charts";

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
  const theLightBlue = useThemeColor({}, "theLightBlue");
  const theTintColor = useThemeColor({}, "tint");
  const theTabBgColor = useThemeColor({}, "tabBackground");
  const theGreenColor = useThemeColor({}, "theGreen");
  const theOrangeColor = useThemeColor({}, "theOrange");

  const data = [
    { value: 15, label: "فروردین" },

    { value: 10, label: "اردیبهشت" },

    { value: 8, label: "خرداد" },

    { value: 58, label: "تیر" },

    { value: 56, label: "مرداد" },

    { value: 78, label: "شهریور" },
  ];

  const data2 = [
    { value: 1 },

    { value: 4 },

    { value: 3 },

    { value: 6 },

    { value: 4 },

    { value: 5 },
  ];

  const pieData = [
    { value: 20, text: "کرایه خانه", color: theTabBgColor },
    { value: 15, text: "رستوران", color: theLightBlue },
    { value: 14, text: "غذای سازمان", color: theGreenColor },
    { value: 11.2, text: "حمل و نقل", color: theLightBlue },
    { value: 10, text: "پفک نمکی", color: theOrangeColor },
    { value: 9, text: "لباس", color: theLightBlue },
    { value: 7, text: "اینترنت", color: theGreenColor },
    { value: 6.8, text: "کافه", color: theOrangeColor },
    { value: 3, text: "سفر", color: theOrangeColor },
    { value: 1, text: "متفرقه", color: theOrangeColor },
  ];

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

  const renderLegend = (text, color) => {
    return (
      <Div style={{ flexDirection: "row" }}>
        <Div
          style={{
            height: 15,

            width: 15,

            marginRight: 10,

            borderRadius: 4,

            backgroundColor: color || "white",
          }}
        />

        <Span style={{ color: "white", fontSize: 16 }}>{text || ""}</Span>
      </Div>
    );
  };

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
      </Div>
      <Spacer height={20} />
      <ScrollView
        style={styles.bottomSection}
        overScrollMode="always"
        fadingEdgeLength={80}
      >
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
            data={data}
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
            spacing={(screenWidth * chartZoomConstant) / (data.length - 1)}
            initialSpacing={screenWidth * 0.07}
            endSpacing={screenWidth * 0.05}
            height={screenHeight * 0.25}
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
            secondaryData={data2}
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
        <Div style={styles.rowChart}>
          <Span type="title" style={styles.chartTitle}>
            بیشتر چی خریدی؟
          </Span>
          <PieChart
            strokeColor={theBGColor}
            strokeWidth={2}
            donut
            data={pieData}
            innerCircleColor={theBGColor}
            innerCircleBorderWidth={0}
            innerRadius={70}
            innerCircleBorderColor={theTintColor}
            labelsPosition="onBorder"
            textSize={11}
            textColor={theBGColor}
            inwardExtraLengthForFocused={50}
          />
          <Div style={{ flexDirection: "row", display: "flex" }}>
            {pieData.map((item, index) => renderLegend(item.text, item.color))}
          </Div>
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
    direction: "ltr",
    // backgroundColor: "#c9fbff11",
    paddingTop: 20,
    paddingBottom: 20,
  },
  chartTitle: {
    marginBottom: 20,
    fontSize: 20,
  },

  rowChart: {
    display: "flex",
    alignItems: "center",
    direction: "rtl",
    backgroundColor: "#c9fbff11",
    borderRadius: 0,
    borderBottomWidth: 0,
    borderBottomColor: "green",
    padding: 30,
  },
});

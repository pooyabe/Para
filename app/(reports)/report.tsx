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

import { LineChart } from "react-native-gifted-charts";

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
    { value: 54, color: "#177AD5" },

    { value: 40, color: "#79D2DE" },

    { value: 20, color: "#ED6665" },
  ];
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
          contentOffset={{x:1000, y: 0}}
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
          <LineChart
            data={data}
            curved
            initialSpacing={screenWidth * 0.05}
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
            spacing={(screenWidth * 0.75) / (data.length - 1)}
            height={screenHeight * 0.3}
            width={screenWidth * 0.79}
            hideDataPoints
            color={theLightBlue}
            yAxisColor={theBGColor}
            yAxisTextStyle={{
              color: theTextColor,
              fontFamily: "VazirRegular",
            }}
            rulesThickness={2}
            rulesType="dashed"
            rulesColor="#c9fbff16"
            xAxisLabelTextStyle={{
              color: theTextColor,
              fontFamily: "VazirRegular",
            }}
            noOfSections={5}
            thickness={2}
            secondaryData={data2}
            secondaryLineConfig={{
              thickness: 2,
              startFillColor: "white",
              endFillColor: "black",
              color: theTintColor,
            }}
            secondaryYAxis={{
              noOfSections: 5,
              showFractionalValues: true,
              roundToDigits: 0,
            }}
          />
        </Div>
        {/* <Div style={styles.singleChart}>
          <PieChartPro
            donut
            isThreeD
            showText
            textColor="black"
            radius={170}
            textSize={20}
            showTextBackground
            textBackgroundRadius={26}
            data={pieData}
          />
        </Div> */}
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
  },
});

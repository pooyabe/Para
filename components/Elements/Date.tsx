import DatePicker, {
  type Props,
} from "@mohamadkh75/react-native-jalali-datepicker";
import { useState } from "react";
import { Modal, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Div } from "./Div";
import { SButton } from "./SButton";

import { Colors } from "@/constants/Colors";
import { useShamsiDate } from "@/hooks/BackEnd/useShamsiDate";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Span } from "./Span";

export type DateProps = Props & {
  style?: object;
  SelectedDate?: string;
  todayMax?: boolean;
  futureYears?: number; // Number of years in future to allow (default 100)
};

export function Date({
  SelectedDate,
  todayMax = false,
  futureYears = 100,
  ...other
}: DateProps) {
  const [modalVisible, setModalVisible] = useState(false);

  const colorScheme = useColorScheme() as "light" | "dark";
  const colors = Colors[colorScheme];
  const insets = useSafeAreaInsets();

  const { nowJalali, toGregorian } = useShamsiDate();

  const JtodayDate = nowJalali();

  const displayDate = SelectedDate || JtodayDate;
  const labelPrefix = SelectedDate ? "تاریخ: " : "امروز: ";
  const OpenLabel = `${labelPrefix}${displayDate}`;

  // Create a far future date in Jalali (current year + futureYears)
  const todayParts = JtodayDate.split("/");
  const futureMaxDateJalali = `${parseInt(todayParts[0]) + futureYears}/${todayParts[1]}/${todayParts[2]}`;

  return (
    <>
      <SButton
        onPress={() => setModalVisible(true)}
        text={OpenLabel}
        style={{
          backgroundColor: "transparent",
          borderWidth: 2,
        }}
      />
      <Modal
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
        statusBarTranslucent
        transparent
      >
        <Div style={{ flex: 1, justifyContent: "flex-end" }}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="بستن انتخابگر تاریخ"
            onPress={() => setModalVisible(false)}
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
              backgroundColor: colors.overlay,
            }}
          />
          <Div
            style={{
              width: "100%",
              height: "82%",
              maxHeight: 720,
              alignItems: "center",
              paddingHorizontal: 20,
              paddingBottom: Math.max(insets.bottom, 16),
              backgroundColor: colors.background,
              borderTopLeftRadius: 28,
              borderTopRightRadius: 28,
              elevation: 16,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: -4 },
              shadowOpacity: 0.16,
              shadowRadius: 12,
            }}
          >
            <Div
              style={{
                width: 40,
                height: 5,
                marginTop: 12,
                marginBottom: 16,
                borderRadius: 3,
                backgroundColor: colors.muted,
                opacity: 0.55,
              }}
            />
            <Span
              type="defaultMedium"
              style={{ fontSize: 20, marginBottom: 12 }}
            >
              تغییر تاریخ
            </Span>
            <DatePicker
              {...other}
              style={{
                width: "100%",
                height: "68%",
                alignSelf: "center",
                backgroundColor: colors.background,
                borderWidth: 1,
                borderColor: Colors[colorScheme].border,
                borderRadius: 15,
                elevation: 5,
                padding: 5,
              }}
              selected={SelectedDate}
              headerContainerStyle={{ height: "15%" }}
              yearMonthBoxStyle={{
                width: "30%",
                height: "50%",
                justifyContent: "center",
                alignItems: "center",
                borderWidth: 1,
                borderColor: colors.border,
                borderRadius: 100,
              }}
              yearMonthTextStyle={{
                fontSize: 22,
                color: Colors[colorScheme].text,
              }}
              iconContainerStyle={{ width: `${100 / 7}%` }}
              backIconStyle={{
                width: 20,
                height: 20,
                resizeMode: "center",
                tintColor: Colors[colorScheme].tint,
              }}
              nextIconStyle={{
                width: 20,
                height: 20,
                resizeMode: "center",
                tintColor: Colors[colorScheme].tint,
              }}
              eachYearStyle={{
                width: `30%`,
                height: `100%`,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: Colors[colorScheme].theLightBlue,
                marginBottom: "5%",
                borderRadius: 10,
                marginHorizontal: "1%",
                elevation: 3,
              }}
              eachYearTextStyle={{
                fontSize: 16,
                color: colors.background,
              }}
              eachMonthStyle={{
                width: `30%`,
                height: `20%`,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: Colors[colorScheme].theLightBlue,
                marginBottom: "3%",
                borderRadius: 10,
                elevation: 3,
              }}
              eachMonthTextStyle={{ fontSize: 16, color: colors.background }}
              weekdaysContainerStyle={{ height: "10%" }}
              weekdayStyle={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
              weekdayTextStyle={{
                fontSize: 16,
                color: Colors[colorScheme].text,
              }}
              borderColor={Colors[colorScheme].border}
              dayStyle={{
                width: `${100 / 7}%`,
                justifyContent: "center",
                alignItems: "center",
                aspectRatio: 1 / 1,
              }}
              selectedDayStyle={{
                width: "70%",
                aspectRatio: 1 / 1,
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 100,
              }}
              selectedDayColor={Colors[colorScheme].theLightBlue}
              dayTextStyle={{ fontSize: 18 }}
              selectedDayTextColor={colors.background}
              dayTextColor={colors.text}
              disabledTextColor={colors.muted}
              onDateChange={(date: Date) => {
                if (typeof other.onDateChange === "function") {
                  other.onDateChange(date);
                }
                setModalVisible(false);
              }}
              // Set maxDate based on todayMax or futureYears
              {...(todayMax
                ? { maxDate: JtodayDate }
                : { maxDate: futureMaxDateJalali })}
            />
            <SButton
              text="بستن"
              onPress={() => setModalVisible(false)}
              style={{
                width: "100%",
                borderWidth: 0,
                borderRadius: 100,
                marginTop: 16,
                height: 50,
                backgroundColor: Colors[colorScheme].theDarkBlue,
              }}
            />
          </Div>
        </Div>
      </Modal>
    </>
  );
}

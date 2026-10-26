import DatePicker, {
  type Props,
} from "@mohamadkh75/react-native-jalali-datepicker";
import { useState } from "react";
import { Modal } from "react-native";
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

export function Date({ SelectedDate, todayMax = false, futureYears = 100, ...other }: DateProps) {
  const [modalVisible, setModalVisible] = useState(false);

  const colorScheme = useColorScheme() as "light" | "dark";
  const colors = Colors[colorScheme];

  const { nowJalali, toGregorian } = useShamsiDate();

  const JtodayDate = nowJalali();

  const displayDate = SelectedDate || JtodayDate;
  const labelPrefix = SelectedDate ? "تاریخ: " : "امروز: ";
  const OpenLabel = `${labelPrefix}${displayDate}`;

  // Create a far future date in Jalali (current year + futureYears)
  const todayParts = JtodayDate.split('/');
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
        transparent
      >
        <Div
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: colors.modalBackground,
          }}
        >
          <Span
            type="defaultMedium"
            style={{ fontWeight: "normal", fontSize: 20, marginBottom: 40 }}
          >
            تغییر تاریخ
          </Span>
          <DatePicker
            {...other}
            style={{
              width: "80%",
              height: "50%",
              alignSelf: "center",
              backgroundColor: Colors[colorScheme].background,
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
            {...(todayMax ? { maxDate: JtodayDate } : { maxDate: futureMaxDateJalali })}
          />
          <SButton
            text="بستن"
            onPress={() => setModalVisible(false)}
            style={{
              width: "80%",
              borderWidth: 0,
              borderRadius: 100,
              marginTop: 50,
              height: 50,
              backgroundColor: Colors[colorScheme].theDarkBlue,
            }}
          />
        </Div>
      </Modal>
    </>
  );
}
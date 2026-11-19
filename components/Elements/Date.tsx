import { useMemo, useState } from "react";
import { Modal, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import DateTimePicker from "react-native-ui-datepicker";
import { Div } from "./Div";
import { SButton } from "./SButton";
import { Span } from "./Span";

import { Colors } from "@/constants/Colors";
import { useShamsiDate } from "@/hooks/BackEnd/useShamsiDate";
import { useColorScheme } from "@/hooks/useColorScheme";

// The component below is named `Date`, which shadows the global Date in this
// module, so keep an explicit reference for date conversions.
const NativeDate = globalThis.Date;
type DateValue = InstanceType<typeof NativeDate>;

export type DateProps = {
  /** Selected date in Jalali format (jYYYY/jMM/jDD). */
  SelectedDate?: string;
  /** Called with the picked date in Jalali format (jYYYY/jMM/jDD). */
  onDateChange?: (date: string) => void;
  /** Disallow dates after today. */
  todayMax?: boolean;
  /** How many years after the current year can be picked (default 10). */
  futureYears?: number;
  /** How many years before the current year can be picked (default 10). */
  pastYears?: number;
  /** Earliest allowed date in Jalali format. Wins over pastYears. */
  minDate?: string;
  /** Latest allowed date in Jalali format. Wins over todayMax/futureYears. */
  maxDate?: string;
  style?: object;
};

export function Date({
  SelectedDate,
  onDateChange,
  todayMax = false,
  futureYears = 10,
  pastYears = 10,
  minDate,
  maxDate,
}: DateProps) {
  const [modalVisible, setModalVisible] = useState(false);

  const colorScheme = useColorScheme() as "light" | "dark";
  const colors = Colors[colorScheme];
  const insets = useSafeAreaInsets();

  const { nowJalali, toGregorian, toJalali } = useShamsiDate();

  const JtodayDate = nowJalali();
  const currentJalaliYear = Number(JtodayDate.split("/")[0]);

  // Jalali dates are converted to local-time Dates so the picker never shifts
  // a day because of the device time zone.
  const jalaliToDate = (jalali?: string): DateValue | undefined => {
    if (!jalali) return undefined;

    const [year, month, day] = toGregorian(jalali)
      .split("-")
      .map((part) => Number(part));

    if (!year || !month || !day) return undefined;

    return new NativeDate(year, month - 1, day);
  };

  const lowerBound = minDate ?? `${currentJalaliYear - pastYears}/01/01`;
  const upperBound =
    maxDate ?? (todayMax ? JtodayDate : `${currentJalaliYear + futureYears}/12/29`);

  const selectedDate = jalaliToDate(SelectedDate ?? JtodayDate);
  const minSelectableDate = jalaliToDate(lowerBound);
  const maxSelectableDate = jalaliToDate(upperBound);

  const displayDate = SelectedDate || JtodayDate;
  const labelPrefix = SelectedDate ? "تاریخ: " : "امروز: ";
  const OpenLabel = `${labelPrefix}${displayDate}`;

  const pickerStyles = useMemo(
    () => ({
      header: { paddingBottom: 4 },
      month_selector: {
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 100,
        backgroundColor: colors.card,
      },
      year_selector: {
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 100,
        backgroundColor: colors.card,
      },
      month_selector_label: {
        fontSize: 16,
        color: colors.text,
        fontFamily: "VazirSemiBold",
      },
      year_selector_label: {
        fontSize: 16,
        color: colors.text,
        fontFamily: "VazirSemiBold",
      },
      button_prev: { padding: 10 },
      button_next: { padding: 10 },
      button_prev_image: { width: 18, height: 18, tintColor: colors.tint },
      button_next_image: { width: 18, height: 18, tintColor: colors.tint },
      weekday_label: {
        fontSize: 13,
        color: colors.muted,
        fontFamily: "VazirRegular",
      },
      day: { margin: 3, borderRadius: 100 },
      day_label: {
        fontSize: 15,
        color: colors.text,
        fontFamily: "VazirRegular",
      },
      today: { borderWidth: 1, borderColor: colors.theLightBlue },
      today_label: { color: colors.theLightBlue },
      outside_label: { color: colors.muted },
      selected: { backgroundColor: colors.theLightBlue },
      selected_label: { color: "#fff", fontFamily: "VazirBold" },
      disabled_label: { color: colors.muted, opacity: 0.45 },
      month: { margin: 3, borderRadius: 10, height: 46 },
      month_label: {
        fontSize: 15,
        color: colors.text,
        fontFamily: "VazirRegular",
      },
      selected_month: { backgroundColor: colors.theLightBlue },
      selected_month_label: { color: "#fff" },
      year: { margin: 3, borderRadius: 10, height: 46 },
      year_label: {
        fontSize: 15,
        color: colors.text,
        fontFamily: "VazirRegular",
      },
      selected_year: { backgroundColor: colors.theLightBlue },
      selected_year_label: { color: "#fff" },
      active_year: { backgroundColor: colors.card },
      active_year_label: { color: colors.text },
    }),
    [colors],
  );

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
              alignItems: "center",
              paddingHorizontal: 20,
              paddingTop: 12,
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
                marginBottom: 16,
                borderRadius: 3,
                backgroundColor: colors.muted,
                opacity: 0.55,
              }}
            />
            <Span
              type="defaultMedium"
              style={{ fontSize: 20, marginBottom: 8 }}
            >
              تغییر تاریخ
            </Span>
            <Div style={{ width: "100%", paddingVertical: 8 }}>
              <DateTimePicker
                mode="single"
                calendar="jalali"
                locale="fa"
                numerals="arabext"
                firstDayOfWeek={6}
                date={selectedDate}
                minDate={minSelectableDate}
                maxDate={maxSelectableDate}
                containerHeight={320}
                weekdaysHeight={28}
                styles={pickerStyles}
                onChange={({ date }) => {
                  if (!date) return;

                  onDateChange?.(toJalali(date as DateValue));
                  setModalVisible(false);
                }}
              />
            </Div>
            <SButton
              text="بستن"
              onPress={() => setModalVisible(false)}
              style={{
                width: "100%",
                borderWidth: 0,
                borderRadius: 100,
                marginTop: 12,
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

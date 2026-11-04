import {
  Date,
  Div,
  IconSymbol,
  Mother,
  Radio,
  SButton,
  Spacer,
  Span,
} from "@/components/Elements";
import { Colors } from "@/constants/Colors";
import { useLoanReminders } from "@/hooks/BackEnd/Pages/useLoanReminders";
import { isLoanReminderNotificationsSupported } from "@/hooks/BackEnd/loanReminders/reminderNotifications";
import {
  describeLoanReminder,
  isOneTimeReminderPassed,
  MODE_LABELS,
  MONTH_DAY_OPTIONS,
  REMINDER_TIME_LABEL,
  WEEKDAY_OPTIONS,
} from "@/hooks/BackEnd/loanReminders/reminderTime";
import { useColorScheme } from "@/hooks/useColorScheme";
import type { Loan } from "@/hooks/DB/actions/getLoans";
import type { LoanReminderMode } from "@/hooks/DB/actions/loanReminders";
import { router, useLocalSearchParams } from "expo-router";
import { useMemo } from "react";
import { Alert, ScrollView, StyleSheet, TouchableOpacity } from "react-native";

const MODE_ORDER: LoanReminderMode[] = ["monthly", "weekly", "once"];

type ChipProps = {
  label: string;
  selected: boolean;
  color: string;
  onPress: () => void;
};

function Chip({ label, selected, color, onPress }: ChipProps) {
  const colors = Colors[useColorScheme()];

  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={[
        styles.chip,
        selected
          ? { backgroundColor: color, borderColor: color }
          : { backgroundColor: "transparent", borderColor: colors.border },
      ]}
    >
      <Span
        type="default"
        style={[styles.chipText, selected ? { color: colors.background } : {}]}
      >
        {label}
      </Span>
    </TouchableOpacity>
  );
}

/**
 * یادآورهای یک مورد بده‌بستون.
 * هر مورد می‌تواند چند یادآور یک‌باره، ماهانه یا هفتگی داشته باشد.
 */
export default function LoanRemindersPage() {
  const colorScheme = useColorScheme() as "light" | "dark";
  const colors = Colors[colorScheme];
  const { loan: loanParam } = useLocalSearchParams<{ loan: string }>();

  const loan = useMemo<Loan | null>(() => {
    if (!loanParam) return null;

    try {
      return JSON.parse(loanParam) as Loan;
    } catch (error) {
      console.error("[LoanReminders] ❌ invalid loan param:", error);
      return null;
    }
  }, [loanParam]);

  const {
    reminders,
    loading,
    saving,
    isFormOpen,
    editingReminder,
    mode,
    setMode,
    dayOfMonth,
    setDayOfMonth,
    dayOfWeek,
    setDayOfWeek,
    onceJalaliDate,
    setOnceJalaliDate,
    openCreateForm,
    openEditForm,
    closeForm,
    saveReminder,
    removeReminder,
  } = useLoanReminders(loan);

  const handleDeleteReminder = (reminderId: number) => {
    const reminder = reminders.find((item) => item.id === reminderId);
    if (!reminder) return;

    Alert.alert("حذف یادآور", "این یادآور حذف شود؟", [
      { text: "لغو", style: "cancel" },
      {
        text: "حذف",
        style: "destructive",
        onPress: () => {
          removeReminder(reminder);
        },
      },
    ]);
  };

  if (!loan) {
    return (
      <Mother>
        <Div style={styles.emptyContainer}>
          <Span style={styles.emptyText}>موردی برای یادآوری پیدا نشد.</Span>
          <Spacer height={16} />
          <SButton
            text="بازگشت"
            onPress={() => router.back()}
            style={{ width: 200 }}
          />
        </Div>
      </Mother>
    );
  }

  const isReceivable = loan.type === "receivable";
  const typeColor = isReceivable ? colors.theLightBlue : colors.theRed;

  return (
    <Mother style={styles.container} _Hpadding={0}>
      <Div style={styles.Header}>
        <Span type="title" style={styles.headerTitle}>
          یادآوری {loan.source}
        </Span>
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel="بازگشت"
          onPress={() => router.back()}
          style={styles.headerButton}
        >
          <IconSymbol
            type="Ionicons"
            name="arrow-back"
            size={20}
            color={colors.text}
          />
        </TouchableOpacity>
      </Div>

      <Spacer height={15} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <Div
          style={[styles.introCard, { backgroundColor: colors.cardAlt }]}
        >
          <Span
            type="defaultMedium"
            style={[styles.introBadge, { color: typeColor }]}
          >
            {isReceivable ? "طلب" : "بدهی"} — {loan.source}
          </Span>
          <Span type="default" style={[styles.introText, { color: colors.muted }]}>
            یادآورها ساعت {REMINDER_TIME_LABEL} در گوشی‌ات اعلان می‌دهند و به
            اینترنت نیازی ندارند.
          </Span>
        </Div>

        <Spacer height={15} />

        {!isLoanReminderNotificationsSupported() && (
          <>
            <Div
              style={[styles.introCard, { backgroundColor: colors.cardAlt }]}
            >
              <Span
                type="defaultMedium"
                style={[styles.introBadge, { color: colors.theOrange }]}
              >
                اعلان در این نسخه فعال نیست
              </Span>
              <Span
                type="default"
                style={[styles.introText, { color: colors.muted }]}
              >
                برای دریافت یادآور باید نسخه نصب‌شده اپ روی گوشی اجرا شود. در این
                حالت می‌توانی یادآورها را ببینی و حذف کنی، اما ثبت یادآور جدید
                انجام نمی‌شود.
              </Span>
            </Div>

            <Spacer height={15} />
          </>
        )}

        {reminders.map((reminder) => (
          <Div
            key={reminder.id}
            style={[styles.reminderCard, { backgroundColor: colors.card }]}
          >
            <Div style={styles.reminderInfo}>
              <Div style={styles.reminderTitleRow}>
                <Span
                  type="default"
                  style={[
                    styles.modeBadge,
                    {
                      color: colors.theLightBlue,
                      backgroundColor: colors.infoBackground,
                    },
                  ]}
                >
                  {MODE_LABELS[reminder.mode]}
                </Span>
                {isOneTimeReminderPassed(reminder) && (
                  <Span
                    type="subtitle"
                    style={{ color: colors.theOrange, fontWeight: "bold" }}
                  >
                    پایان‌یافته
                  </Span>
                )}
              </Div>
              <Span type="default" style={styles.reminderText}>
                {describeLoanReminder(reminder)}
              </Span>
            </Div>

            <Div style={styles.reminderActions}>
              <TouchableOpacity
                accessibilityRole="button"
                accessibilityLabel="ویرایش یادآور"
                onPress={() => openEditForm(reminder)}
                disabled={saving}
              >
                <IconSymbol
                  type="Ionicons"
                  name="create-outline"
                  size={22}
                  color={colors.theLightBlue}
                />
              </TouchableOpacity>
              <TouchableOpacity
                accessibilityRole="button"
                accessibilityLabel="حذف یادآور"
                onPress={() => handleDeleteReminder(reminder.id)}
                disabled={saving}
              >
                <IconSymbol
                  type="Ionicons"
                  name="trash-outline"
                  size={22}
                  color={colors.theRed}
                />
              </TouchableOpacity>
            </Div>
          </Div>
        ))}

        {loading && (
          <Div style={styles.loadingContainer}>
            <Span style={[styles.emptyText, { color: colors.muted }]}>
              در حال بارگذاری...
            </Span>
          </Div>
        )}

        {!loading && reminders.length === 0 && !isFormOpen && (
          <Div style={styles.emptyContainer}>
            <IconSymbol
              type="Ionicons"
              name="notifications-off-outline"
              size={44}
              color={colors.tabIconDefault}
            />
            <Spacer height={10} />
            <Span style={[styles.emptyText, { color: colors.muted }]}>
              هنوز یادآوری‌ای برای این مورد تنظیم نکردی.
            </Span>
          </Div>
        )}

        <Spacer height={15} />

        {isFormOpen ? (
          <Div
            style={[styles.formCard, { backgroundColor: colors.card }]}
          >
            <Span type="defaultMedium" style={styles.formTitle}>
              {editingReminder ? "ویرایش یادآور" : "یادآور جدید"}
            </Span>

            <Spacer height={10} />

            <Radio
              Items={MODE_ORDER.map((item) => MODE_LABELS[item])}
              selectedIndex={MODE_ORDER.indexOf(mode)}
              onChangeValueWithIndex={(value, index) => {
                const nextMode = MODE_ORDER[index];
                if (nextMode) setMode(nextMode);
              }}
            />

            <Spacer height={20} />

            {mode === "monthly" && (
              <>
                <Span type="subtitle" style={{ color: colors.muted }}>
                  روز ماه (شمسی)
                </Span>
                <Spacer height={8} />
                <Div style={styles.chipGrid}>
                  {MONTH_DAY_OPTIONS.map((option) => (
                    <Chip
                      key={option.value}
                      label={option.label}
                      selected={dayOfMonth === option.value}
                      color={colors.theLightBlue}
                      onPress={() => setDayOfMonth(option.value)}
                    />
                  ))}
                </Div>
                <Spacer height={8} />
                <Span type="subtitle" style={{ color: colors.muted }}>
                  ماه‌هایی که این روز را ندارند یادآوری نمی‌فرستند.
                </Span>
              </>
            )}

            {mode === "weekly" && (
              <>
                <Span type="subtitle" style={{ color: colors.muted }}>
                  روز هفته
                </Span>
                <Spacer height={8} />
                <Div style={styles.chipGrid}>
                  {WEEKDAY_OPTIONS.map((option) => (
                    <Chip
                      key={option.value}
                      label={option.label}
                      selected={dayOfWeek === option.value}
                      color={colors.theLightBlue}
                      onPress={() => setDayOfWeek(option.value)}
                    />
                  ))}
                </Div>
              </>
            )}

            {mode === "once" && (
              <>
                <Span type="subtitle" style={{ color: colors.muted }}>
                  تاریخ یادآوری
                </Span>
                <Spacer height={8} />
                <Date
                  SelectedDate={onceJalaliDate}
                  onDateChange={(date: string) => {
                    setOnceJalaliDate(date);
                  }}
                  style={{}}
                />
              </>
            )}

            <Spacer height={14} />

            <Span type="subtitle" style={{ color: colors.muted }}>
              ساعت ارسال: {REMINDER_TIME_LABEL}
            </Span>

            <Spacer height={20} />

            <SButton
              text={saving ? "در حال ذخیره..." : "ذخیره یادآور"}
              onPress={saveReminder}
              disabled={saving}
            />

            <Spacer height={10} />

            <SButton
              text="انصراف"
              onPress={closeForm}
              disabled={saving}
              style={{
                backgroundColor: "transparent",
                borderWidth: 1.5,
                height: 50,
              }}
            />
          </Div>
        ) : (
          <SButton text="افزودن یادآور" onPress={openCreateForm} />
        )}

        <Spacer height={40} />
      </ScrollView>
    </Mother>
  );
}

const styles = StyleSheet.create({
  container: {
    direction: "rtl",
    display: "flex",
    flex: 1,
  },
  Header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 30,
    paddingTop: 18,
  },
  headerTitle: {
    flex: 1,
    verticalAlign: "middle",
    fontSize: 18,
  },
  headerButton: {
    padding: 6,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  introCard: {
    borderRadius: 15,
    padding: 15,
    rowGap: 6,
  },
  introBadge: {
    fontSize: 14,
  },
  introText: {
    fontSize: 13,
    lineHeight: 22,
  },
  reminderCard: {
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    columnGap: 10,
  },
  reminderInfo: {
    flex: 1,
    rowGap: 6,
  },
  reminderTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 8,
  },
  modeBadge: {
    fontSize: 12,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
    overflow: "hidden",
  },
  reminderText: {
    fontSize: 14,
  },
  reminderActions: {
    flexDirection: "row",
    columnGap: 14,
  },
  chipGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    minWidth: 44,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1.5,
    alignItems: "center",
  },
  chipText: {
    fontSize: 13,
  },
  formCard: {
    borderRadius: 15,
    padding: 16,
  },
  formTitle: {
    fontSize: 16,
  },
  loadingContainer: {
    alignItems: "center",
    paddingVertical: 20,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 15,
    textAlign: "center",
  },
});

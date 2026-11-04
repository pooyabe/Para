import type { LoanReminder } from "@/hooks/DB/actions/loanReminders";
import { requireOptionalNativeModule } from "expo";
import type * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import {
  getMonthlyOccurrences,
  getOnceReminderDateTime,
  REMINDER_HOUR,
  REMINDER_MINUTE,
} from "./reminderTime";

type NotificationsModule = typeof import("expo-notifications");

/**
 * ماژول‌های نیتیوی که `expo-notifications` هنگام بارگذاری لازم دارد.
 *
 * در محیط‌هایی مثل اکسپو گو بخشی از این‌ها (مثلاً ماژول اشتراک موضوع) وجود
 * ندارد و ایمپورت پکیج با خطای «Cannot find native module» شکست می‌خورد.
 * پس پیش از ایمپورت، وجودشان را بدون خطا بررسی می‌کنیم؛ در غیر این صورت
 * ایمپورتی انجام نمی‌شود و مشکل فقط به «پشتیبانی نشدن» تبدیل می‌شود.
 */
const NOTIFICATIONS_NATIVE_MODULES = [
  "ExpoNotificationScheduler",
  "ExpoNotificationPermissionsModule",
  "ExpoNotificationPresenter",
  "ExpoNotificationsEmitter",
  "ExpoNotificationsHandlerModule",
  "ExpoPushTokenManager",
  ...(Platform.OS === "android" ? ["ExpoTopicSubscriptionModule"] : []),
];

function notificationsNativeModulesAvailable(): boolean {
  try {
    return NOTIFICATIONS_NATIVE_MODULES.every(
      (name) => requireOptionalNativeModule<unknown>(name) != null,
    );
  } catch (error) {
    console.warn("[LoanReminders] native module check failed:", error);
    return false;
  }
}

/**
 * ماژول اعلان به‌صورت تنبل بارگذاری می‌شود.
 *
 * ایمپورت مستقیم در محیطی که ماژول نیتیو ندارد، برنامه را از کار می‌اندازد
 * (و حتی وقتی خطا گرفته شود، مترو آن را قرمز چاپ می‌کند)؛ بنابراین اول
 * پشتیبانی بررسی و نتیجه کش می‌شود.
 */
let notificationsModule: NotificationsModule | null | undefined;

function getNotificationsModule(): NotificationsModule | null {
  if (Platform.OS !== "android" && Platform.OS !== "ios") return null;
  if (notificationsModule !== undefined) return notificationsModule;

  if (!notificationsNativeModulesAvailable()) {
    notificationsModule = null;
    return null;
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports -- عمداً تنبل بارگذاری می‌شود تا در محیط بدون ماژول نیتیو برنامه از کار نیفتد.
    notificationsModule = require("expo-notifications") as NotificationsModule;
  } catch (error) {
    console.warn("[LoanReminders] notifications module unavailable:", error);
    notificationsModule = null;
  }

  return notificationsModule;
}

/**
 * آیا در این محیط می‌توان اعلان زمان‌بندی کرد؟
 * روی وب یا وقتی ماژول نیتیو موجود نیست، مقدار false برمی‌گردد.
 */
export function isLoanReminderNotificationsSupported(): boolean {
  return getNotificationsModule() !== null;
}

const CHANNEL_ID = "loan-reminders";
const CHANNEL_NAME = "یادآوری بده‌بستون‌ها";

/** اطلاعات موردی که اعلان یادآور به آن اشاره می‌کند. */
export interface LoanReminderNotificationTarget {
  id: number;
  source: string;
  type: "receivable" | "payable";
  amount: number;
  paid_amount: number;
}

export type ReminderSchedule = Pick<
  LoanReminder,
  "id" | "mode" | "once_date" | "day_of_month" | "day_of_week"
>;

interface ReminderTrigger {
  identifier: string;
  trigger: Notifications.NotificationTriggerInput;
}

/** اعلان یادآور وقتی برنامه در حال اجراست هم نمایش داده شود. */
export function registerLoanReminderNotificationHandler(): void {
  const notifications = getNotificationsModule();
  if (!notifications) return;

  notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
}

async function ensureLoanReminderChannel(
  notifications: NotificationsModule,
): Promise<void> {
  if (Platform.OS !== "android") return;

  await notifications.setNotificationChannelAsync(CHANNEL_ID, {
    name: CHANNEL_NAME,
    importance: notifications.AndroidImportance.HIGH,
    sound: "default",
    vibrationPattern: [0, 250, 250, 250],
  });
}

function allowsNotifications(
  notifications: NotificationsModule,
  status: Notifications.NotificationPermissionsStatus,
): boolean {
  return (
    status.granted ||
    status.ios?.status === notifications.IosAuthorizationStatus.PROVISIONAL
  );
}

/**
 * اجازه اعلان را بررسی می‌کند و در صورت امکان از کاربر می‌پرسد.
 * بدون اجازه، یادآور کاری انجام نمی‌دهد؛ پس ثبت یادآور هم انجام نمی‌شود.
 */
export async function ensureLoanReminderPermission(): Promise<boolean> {
  const notifications = getNotificationsModule();
  if (!notifications) return false;

  await ensureLoanReminderChannel(notifications);

  const current = await notifications.getPermissionsAsync();
  if (allowsNotifications(notifications, current)) return true;
  if (!current.canAskAgain) return false;

  const requested = await notifications.requestPermissionsAsync();
  return allowsNotifications(notifications, requested);
}

const pad = (value: number) => String(value).padStart(2, "0");

/** کلید یکتای هر تاریخ در شناسه اعلان، بدون تبدیل تقویم. */
const dateKey = (date: Date) =>
  `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}`;

/**
 * اعلان‌های لازم برای یک یادآور.
 *
 * یادآور ماهانه با اعلان‌های تک‌زمانی ساخته می‌شود (پنجره چند ماه آینده)،
 * چون تریگر ماهانه سیستم‌عامل با تقویم میلادی کار می‌کند و روز ماه شمسی را
 * درست نمی‌شناسد؛ روزهای ۳۱ در ماه‌های کوتاه هم آن را از کار می‌انداخت.
 */
export function buildLoanReminderTriggers(
  reminder: ReminderSchedule,
): ReminderTrigger[] {
  const notifications = getNotificationsModule();
  if (!notifications) return [];

  const prefix = `loan-reminder-${reminder.id}`;
  const channelProps =
    Platform.OS === "android" ? { channelId: CHANNEL_ID } : {};

  switch (reminder.mode) {
    case "once": {
      if (!reminder.once_date) return [];

      const date = getOnceReminderDateTime(reminder.once_date);
      if (date.getTime() <= Date.now()) return [];

      return [
        {
          identifier: `${prefix}-once`,
          trigger: {
            type: notifications.SchedulableTriggerInputTypes.DATE,
            date,
            ...channelProps,
          },
        },
      ];
    }
    case "weekly": {
      const weekday = reminder.day_of_week;
      if (!weekday || weekday < 1 || weekday > 7) return [];

      return [
        {
          identifier: `${prefix}-weekly`,
          trigger: {
            type: notifications.SchedulableTriggerInputTypes.WEEKLY,
            weekday,
            hour: REMINDER_HOUR,
            minute: REMINDER_MINUTE,
            ...channelProps,
          },
        },
      ];
    }
    case "monthly": {
      const dayOfMonth = reminder.day_of_month;
      if (!dayOfMonth) return [];

      return getMonthlyOccurrences(dayOfMonth).map((date) => ({
        identifier: `${prefix}-${dateKey(date)}`,
        trigger: {
          type: notifications.SchedulableTriggerInputTypes.DATE,
          date,
          ...channelProps,
        },
      }));
    }
    default:
      return [];
  }
}

function buildLoanReminderContent(
  target: LoanReminderNotificationTarget,
): Notifications.NotificationContentInput {
  const remaining = Math.max(target.amount - target.paid_amount, 0);

  return {
    title: target.type === "receivable" ? "یادآوری طلب" : "یادآوری بدهی",
    body: `${target.source} — مانده: ${remaining.toLocaleString("fa-IR")} تومان`,
    sound: "default",
    data: { loanId: target.id },
  };
}

/**
 * اعلان‌های یک یادآور را در سیستم‌عامل زمان‌بندی می‌کند و شناسه‌ها را برمی‌گرداند.
 * اگر یکی از اعلان‌ها ثبت نشود، بقیه لغو می‌شوند تا زمان‌بندی نیمه‌کاره نماند.
 */
export async function scheduleLoanReminderNotifications(
  target: LoanReminderNotificationTarget,
  reminder: ReminderSchedule,
): Promise<string[]> {
  const notifications = getNotificationsModule();
  if (!notifications) return [];

  await ensureLoanReminderChannel(notifications);

  const content = buildLoanReminderContent(target);
  const scheduledIds: string[] = [];

  try {
    for (const { identifier, trigger } of buildLoanReminderTriggers(reminder)) {
      const id = await notifications.scheduleNotificationAsync({
        identifier,
        content,
        trigger,
      });

      scheduledIds.push(id);
    }
  } catch (error) {
    await cancelLoanReminderNotifications(scheduledIds);
    throw error;
  }

  return scheduledIds;
}

/** لغو اعلان‌های زمان‌بندی‌شده؛ خطای لغو نباید جلوی ادامه کار را بگیرد. */
export async function cancelLoanReminderNotifications(
  notificationIds: string[],
): Promise<void> {
  const notifications = getNotificationsModule();
  if (!notifications || notificationIds.length === 0) return;

  for (const identifier of notificationIds) {
    try {
      await notifications.cancelScheduledNotificationAsync(identifier);
    } catch (error) {
      console.warn("[LoanReminders] cancel failed:", identifier, error);
    }
  }
}

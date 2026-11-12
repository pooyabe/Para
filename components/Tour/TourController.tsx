import { Colors } from "@/constants/Colors";
import { getSetting, setSetting } from "@/hooks/DB";
import { useColorScheme } from "@/hooks/useColorScheme";
import { router } from "expo-router";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  type ReactNode,
} from "react";
import {
  TourProvider,
  useTour,
  type TooltipApi,
  type TourLabels,
} from "react-native-interactive-tour";

import { TourTooltip } from "./TourTooltip";
import { TOUR_STEPS } from "./tourSteps";

/** کلید تنظیمات محلی که نشان می‌دهد کاربر تور را دیده است. */
export const TOUR_SETTING_KEY = "interactive_tour_seen";

const TOUR_ID = "interactive-tour";

/** مدت‌زمان لازم تا صفحه راهنما بسته شود و تب‌ها دوباره دیده شوند. */
const START_AFTER_BACK_MS = 260;

const TOUR_LABELS: Partial<TourLabels> = {
  next: "بعدی",
  back: "قبلی",
  skip: "رد کردن",
  done: "تمومه",
  targetHint: "روی بخش هایلایت‌شده بزن",
};

// خارج از کامپوننت تعریف می‌شود تا هویت تابع بین رندرها ثابت بماند.
const renderTooltip = (api: TooltipApi) => <TourTooltip api={api} />;

type InteractiveTourContextValue = {
  startInteractiveTour: () => void;
};

const InteractiveTourContext =
  createContext<InteractiveTourContextValue | null>(null);

/**
 * دسترسی به تور تعاملی از داخل صفحات (مثلا صفحه راهنما).
 */
export function useInteractiveTour(): InteractiveTourContextValue {
  const context = useContext(InteractiveTourContext);

  if (!context) {
    throw new Error(
      "useInteractiveTour must be used inside InteractiveTourProvider",
    );
  }

  return context;
}

/**
 * تور تعاملی برنامه: اولین بار که برنامه باز می‌شود خودکار اجرا می‌شود و از
 * صفحه راهنما هم می‌توان دوباره اجرایش کرد.
 */
export function InteractiveTourProvider({ children }: { children: ReactNode }) {
  const colors = Colors[useColorScheme()];

  const theme = useMemo(
    () => ({
      dimColor: colors.overlay,
      ringColor: colors.theGreen,
      ringWidth: 2,
      spotlightPadding: 6,
      spotlightRadius: 16,
      tooltip: {
        backgroundColor: colors.background,
        titleColor: colors.text,
        textColor: colors.text,
        buttonColor: colors.tint,
        buttonTextColor: colors.background,
        secondaryTextColor: colors.muted,
        borderRadius: 20,
      },
    }),
    [colors],
  );

  const markTourAsSeen = useCallback(() => {
    void setSetting(TOUR_SETTING_KEY, "1");
  }, []);

  return (
    <TourProvider
      theme={theme}
      labels={TOUR_LABELS}
      renderTooltip={renderTooltip}
      targetTimeoutMs={4000}
      waitingGraceMs={1500}
      dismissOnBack
      onTourComplete={markTourAsSeen}
      onTourSkip={markTourAsSeen}
    >
      <TourRunner>{children}</TourRunner>
    </TourProvider>
  );
}

/**
 * تور را به صفحات معرفی می‌کند و اجرای خودکار اولین‌بار را مدیریت می‌کند.
 */
function TourRunner({ children }: { children: ReactNode }) {
  const { start } = useTour();
  // جلوگیری از اجرای دوباره در صورت رندر مجدد افکت.
  const autoStartHandled = useRef(false);

  useEffect(() => {
    let isMounted = true;

    getSetting(TOUR_SETTING_KEY).then((seen) => {
      if (!isMounted || autoStartHandled.current || seen !== null) return;

      autoStartHandled.current = true;
      start(TOUR_ID, TOUR_STEPS);
    });

    return () => {
      isMounted = false;
    };
  }, [start]);

  const startInteractiveTour = useCallback(() => {
    // صفحه راهنما روی تب‌ها باز می‌شود؛ اول برمی‌گردیم تا تب‌های
    // هایلایت‌شده در تور واقعا دیده شوند.
    if (router.canGoBack()) {
      router.back();
    } else {
      router.navigate("/spending");
    }

    setTimeout(() => start(TOUR_ID, TOUR_STEPS), START_AFTER_BACK_MS);
  }, [start]);

  const value = useMemo(
    () => ({ startInteractiveTour }),
    [startInteractiveTour],
  );

  return (
    <InteractiveTourContext.Provider value={value}>
      {children}
    </InteractiveTourContext.Provider>
  );
}

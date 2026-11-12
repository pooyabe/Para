import { Span } from "@/components/Elements";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import {
  I18nManager,
  Pressable,
  StyleSheet,
  View,
  useWindowDimensions,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import type { TooltipApi } from "react-native-interactive-tour";

import { INTERACTIVE_TOUR_STEPS, type TourArrowSide } from "./tourSteps";

const ARROW_WIDTH = 22;
const ARROW_HEIGHT = 10;
/** حاشیه افقی‌ای که کتابخانه برای تولتیپ کنار می‌گذارد. */
const OVERLAY_INSET = 16;
const ARROW_EDGE_GAP = 14;

function TooltipArrow({
  side,
  color,
  left,
}: {
  side: TourArrowSide;
  color: string;
  left: number;
}) {
  return (
    <Svg
      width={ARROW_WIDTH}
      height={ARROW_HEIGHT}
      pointerEvents="none"
      style={[
        styles.arrow,
        side === "up" ? styles.arrowUp : styles.arrowDown,
        { left },
      ]}
    >
      <Path
        d={side === "up" ? "M11 0L22 10L0 10Z" : "M11 10L0 0L22 0Z"}
        fill={color}
      />
    </Svg>
  );
}

/**
 * تولتیپ فارسی تور؛ فلش SVG سمت المان هایلایت‌شده را نشانه می‌گیرد و دکمه
 * «رد کردن» همیشه در دسترس است.
 */
export function TourTooltip({ api }: { api: TooltipApi }) {
  const colors = Colors[useColorScheme()];
  const { width } = useWindowDimensions();

  const stepConfig = INTERACTIVE_TOUR_STEPS[api.stepIndex];
  const isInteractive = (api.step.advanceOn ?? "next") === "target-press";
  const cardColor = colors.background;

  // در چیدمان راست‌به‌چپ ترتیب تب‌ها برعکس می‌شود، پس محل افقی فلش هم آینه می‌شود.
  const arrowRatio = stepConfig?.arrowX ?? 0.5;
  const horizontalRatio = I18nManager.isRTL ? 1 - arrowRatio : arrowRatio;
  const maxArrowLeft =
    width - OVERLAY_INSET * 2 - ARROW_EDGE_GAP - ARROW_WIDTH;
  const arrowLeft = Math.min(
    Math.max(
      horizontalRatio * width - OVERLAY_INSET - ARROW_WIDTH / 2,
      ARROW_EDGE_GAP,
    ),
    maxArrowLeft,
  );

  return (
    <View>
      {stepConfig?.arrow === "up" ? (
        <TooltipArrow side="up" color={cardColor} left={arrowLeft} />
      ) : null}

      <View
        style={[
          styles.card,
          { backgroundColor: cardColor, borderColor: colors.divider },
        ]}
      >
        <View style={styles.header}>
          <Span type="subtitle" style={{ color: colors.muted }}>
            {`${(api.stepIndex + 1).toLocaleString("fa-IR")} از ${api.totalSteps.toLocaleString("fa-IR")}`}
          </Span>

          <Pressable
            onPress={api.stop}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel={api.labels.skip}
            style={({ pressed }) => [
              styles.skipButton,
              { borderColor: colors.divider, opacity: pressed ? 0.6 : 1 },
            ]}
          >
            <Span
              type="defaultMedium"
              style={[styles.smallText, { color: colors.muted }]}
            >
              {api.labels.skip}
            </Span>
          </Pressable>
        </View>

        <Span type="defaultBold" style={[styles.title, { color: colors.text }]}>
          {api.step.title}
        </Span>

        {api.step.text ? (
          <Span style={[styles.body, { color: colors.text }]}>
            {api.step.text}
          </Span>
        ) : null}

        <View style={styles.footer}>
          {api.isFirst ? (
            <View />
          ) : (
            <Pressable
              onPress={api.back}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel={api.labels.back}
            >
              <Span
                type="defaultMedium"
                style={[styles.smallText, { color: colors.muted }]}
              >
                {api.labels.back}
              </Span>
            </Pressable>
          )}

          {isInteractive ? (
            <Span
              type="subtitle"
              style={[styles.hint, { color: colors.muted }]}
            >
              {api.labels.targetHint}
            </Span>
          ) : (
            <Pressable
              onPress={api.next}
              accessibilityRole="button"
              accessibilityLabel={api.isLast ? api.labels.done : api.labels.next}
              style={({ pressed }) => [
                styles.primaryButton,
                { backgroundColor: colors.tint, opacity: pressed ? 0.75 : 1 },
              ]}
            >
              <Span
                type="defaultSemiBold"
                style={{ color: colors.background, fontSize: 14 }}
              >
                {api.isLast ? api.labels.done : api.labels.next}
              </Span>
            </Pressable>
          )}
        </View>
      </View>

      {stepConfig?.arrow === "down" ? (
        <TooltipArrow side="down" color={cardColor} left={arrowLeft} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 18,
    rowGap: 8,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.22,
    shadowRadius: 14,
  },
  header: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
  },
  skipButton: {
    borderWidth: 1,
    borderRadius: 100,
    paddingHorizontal: 12,
    paddingVertical: 3,
  },
  title: {
    fontSize: 18,
    lineHeight: 28,
    textAlign: "right",
    writingDirection: "rtl",
  },
  body: {
    fontSize: 14,
    lineHeight: 26,
    textAlign: "right",
    writingDirection: "rtl",
  },
  footer: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 6,
    columnGap: 12,
  },
  primaryButton: {
    borderRadius: 100,
    paddingHorizontal: 22,
    paddingVertical: 9,
  },
  smallText: {
    fontSize: 13,
  },
  hint: {
    flexShrink: 1,
    textAlign: "left",
    fontSize: 11,
    lineHeight: 18,
  },
  arrow: {
    position: "absolute",
    zIndex: 3,
  },
  arrowUp: {
    top: 1 - ARROW_HEIGHT,
  },
  arrowDown: {
    bottom: 1 - ARROW_HEIGHT,
  },
});

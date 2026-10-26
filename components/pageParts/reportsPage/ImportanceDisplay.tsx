import { Div, Span } from "@/components/Elements";
import { Colors } from "@/constants/Colors";
import { ImportanceData } from "@/hooks/DB/reports/useImportanceDistribution";
import { useColorScheme } from "@/hooks/useColorScheme";
import { StyleSheet } from "react-native";

interface ImportanceDisplayProps {
  data: ImportanceData;
}

function formatNumber(num: number): string {
  return new Intl.NumberFormat("fa-IR").format(num);
}

export function ImportanceDisplay({ data }: ImportanceDisplayProps) {
  const colors = Colors[useColorScheme()];

  if (data.total === 0) {
    return null;
  }

  const alkaaeiPercent = Math.round((data.alkaaei / data.total) * 100);
  const borderlinePercent = Math.round((data.borderline / data.total) * 100);

  return (
    <Div style={styles.container}>
      <Div
        style={[
          styles.itemContainer,
          {
            backgroundColor: colors.warningBackground,
            borderColor: colors.theOrange,
          },
        ]}
      >
        <Span type="subtitle" style={styles.itemLabel}>
          🚫 هزینه‌های الکی
        </Span>
        <Span style={[styles.percentage, { color: colors.theOrange }]}>
          {alkaaeiPercent}درصد
        </Span>
        <Span style={[styles.amount, { color: colors.muted }]}>
          {formatNumber(data.alkaaei)} تومن
        </Span>
        <Span style={[styles.message, { color: colors.muted }]}>
          یعنی مقدار {formatNumber(data.alkaaei)} تومن خرج کردی که کاملاً
          بی‌فایده بوده و میتونستی اصلاً انجامش ندی!
        </Span>
        {data.alkaaeiTopItem && (
          <Div
            style={[styles.topItemContainer, { borderTopColor: colors.divider }]}
          >
            <Span style={[styles.topItemLabel, { color: colors.muted }]}>
              بیشترین هزینه الکی:
            </Span>
            <Span style={[styles.topItemValue, { color: colors.theLightBlue }]}>
              {data.alkaaeiTopItem.title} (
              {formatNumber(data.alkaaeiTopItem.amount)} تومن)
            </Span>
          </Div>
        )}
      </Div>

      <Div
        style={[
          styles.itemContainer,
          {
            backgroundColor: colors.infoBackground,
            borderLeftWidth: 0,
            borderRightWidth: 4,
            borderColor: colors.theLightBlue,
          },
        ]}
      >
        <Span type="subtitle" style={styles.itemLabel}>
          ⚠️ هزینه‌های قابل حذف
        </Span>
        <Span style={[styles.percentage, { color: colors.theLightBlue }]}>
          {borderlinePercent}درصد
        </Span>
        <Span style={[styles.amount, { color: colors.muted }]}>
          {formatNumber(data.borderline)} تومن
        </Span>
        <Span style={[styles.message, { color: colors.muted }]}>
          مقدار {formatNumber(data.borderline)} تومن هم خرج کردی که میتونستی
          نکنی. بهرحال خودت میدونی.
        </Span>
        {data.borderlineTopItem && (
          <Div
            style={[styles.topItemContainer, { borderTopColor: colors.divider }]}
          >
            <Span style={[styles.topItemLabel, { color: colors.muted }]}>
              بیشترین هزینه قابل حذف:
            </Span>
            <Span style={[styles.topItemValue, { color: colors.theLightBlue }]}>
              {data.borderlineTopItem.title} (
              {formatNumber(data.borderlineTopItem.amount)} تومن)
            </Span>
          </Div>
        )}
      </Div>

      <Div
        style={[
          styles.summaryContainer,
          {
            backgroundColor: colors.warningBackground,
            borderLeftColor: colors.theOrange,
          },
        ]}
      >
        <Span style={[styles.summaryText, { color: colors.muted }]}>
          در مجموع، {formatNumber(data.alkaaei + data.borderline)} تومن (
          {alkaaeiPercent + borderlinePercent}درصد) از هزینه‌هات میتونست کاهش
          پیدا کنه.
        </Span>
      </Div>
    </Div>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 30,
    paddingHorizontal: "2.5%",
    gap: 20,
  },
  title: {
    textAlign: "center",
    marginBottom: 10,
  },
  itemContainer: {
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
  },
  itemLabel: {
    marginBottom: 10,
    fontSize: 16,
  },
  percentage: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  amount: {
    fontSize: 14,
    marginBottom: 10,
    textAlign: "right",
  },
  message: {
    fontSize: 13,
    lineHeight: 20,
    textAlign: "right",
    marginBottom: 10,
  },
  topItemContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
  },
  topItemLabel: {
    fontSize: 12,
    marginBottom: 6,
    fontWeight: "600",
    textAlign: "right",
  },
  topItemValue: {
    fontSize: 13,
    fontWeight: "500",
    textAlign: "right",
  },
  summaryContainer: {
    marginTop: 10,
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 3,
  },
  summaryText: {
    fontSize: 12,
    textAlign: "right",
  },
});

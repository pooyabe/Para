import { Div, Span } from "@/components/Elements";
import { ImportanceData } from "@/hooks/DB/reports/useImportanceDistribution";
import { StyleSheet } from "react-native";

interface ImportanceDisplayProps {
  data: ImportanceData;
}

function formatNumber(num: number): string {
  return new Intl.NumberFormat("fa-IR").format(num);
}

export function ImportanceDisplay({ data }: ImportanceDisplayProps) {
  if (data.total === 0) {
    return null;
  }

  const alkaaeiPercent = Math.round((data.alkaaei / data.total) * 100);
  const borderlinePercent = Math.round((data.borderline / data.total) * 100);

  return (
    <Div style={styles.container}>
      <Span type="title" style={styles.title}>
        تحلیل اهمیت هزینه‌ها
      </Span>

      <Div style={styles.itemContainer}>
        <Span type="subtitle" style={styles.itemLabel}>
          🚫 هزینه‌های الکی
        </Span>
        <Span style={styles.percentage}>{alkaaeiPercent}درصد</Span>
        <Span style={styles.amount}>{formatNumber(data.alkaaei)} تومن</Span>
        <Span style={styles.message}>
          بیشتر از این میزان {formatNumber(data.alkaaei)} تومن از هزینه‌های این
          بازه زمانی الکی بوده.
        </Span>
      </Div>

      <Div style={styles.itemContainer}>
        <Span type="subtitle" style={styles.itemLabel}>
          ⚠️ هزینه‌های قابل حذف
        </Span>
        <Span style={styles.percentage}>{borderlinePercent}درصد</Span>
        <Span style={styles.amount}>{formatNumber(data.borderline)} تومن</Span>
        <Span style={styles.message}>
          مقدار {formatNumber(data.borderline)} تومن هم خرج کردی که میتونستی
          نکنی. بهرحال خودت میدونی.
        </Span>
      </Div>

      <Div style={styles.summaryContainer}>
        <Span style={styles.summaryText}>
          در مجموع، {formatNumber(data.alkaaei + data.borderline)} تومن (
          {alkaaeiPercent + borderlinePercent}درصد) از هزینه‌هایت میتونست کاهش
          پیدا کنه.
        </Span>
      </Div>
    </Div>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 30,
    paddingHorizontal: 20,
    gap: 20,
  },
  title: {
    textAlign: "center",
    marginBottom: 10,
  },
  itemContainer: {
    borderRadius: 12,
    padding: 16,
    backgroundColor: "rgba(17, 141, 255, 0.1)",
    borderLeftWidth: 4,
    borderLeftColor: "#118dff",
  },
  itemLabel: {
    marginBottom: 10,
    fontSize: 16,
  },
  percentage: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#118dff",
    marginBottom: 8,
  },
  amount: {
    fontSize: 14,
    color: "#666",
    marginBottom: 10,
    textAlign: "right",
  },
  message: {
    fontSize: 13,
    color: "#555",
    lineHeight: 20,
    textAlign: "right",
  },
  summaryContainer: {
    marginTop: 10,
    padding: 12,
    backgroundColor: "rgba(255, 193, 7, 0.1)",
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: "#ffc107",
  },
  summaryText: {
    fontSize: 12,
    color: "#555",
    textAlign: "right",
  },
});

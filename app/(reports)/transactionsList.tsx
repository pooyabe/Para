import { Div, IconSymbol, Mother, Spacer, Span } from "@/components/Elements";
import TransactionItem from "@/components/pageParts/reportsPage/TransactionItem";
import { Colors } from "@/constants/Colors";
import {
  Transaction,
  getTransactions,
} from "@/hooks/DB/reports/useTransactions";
import { useColorScheme } from "@/hooks/useColorScheme";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

const PAGE_SIZE = 10;

export default function TransactionsList() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [offset, setOffset] = useState<number>(0);

  const colorScheme = useColorScheme() as "light" | "dark";

  const loadTransactions = async (reset: boolean = false) => {
    if (loading || (!hasMore && !reset)) return;

    setLoading(true);
    try {
      const newOffset = reset ? 0 : offset;
      const newTransactions = await getTransactions(PAGE_SIZE, newOffset);

      if (reset) {
        setTransactions(newTransactions);
        setOffset(PAGE_SIZE);
      } else {
        setTransactions((prev) => [...prev, ...newTransactions]);
        setOffset((prev) => prev + PAGE_SIZE);
      }

      if (newTransactions.length < PAGE_SIZE) {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error loading transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTransactions(true);
  }, []);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const isCloseToBottom =
      layoutMeasurement.height + contentOffset.y >= contentSize.height - 50;

    if (isCloseToBottom && hasMore && !loading) {
      loadTransactions();
    }
  };

  return (
    <Mother style={styles.container} _Hpadding={0}>
      <Div style={styles.Header}>
        <Span type="title" style={styles.headerTitle}>
          لیست تراکنش‌ها
        </Span>

        {/* Back to Report Button */}
        <TouchableOpacity
          onPress={() => {
            router.back();
          }}
        >
          <IconSymbol
            type="Ionicons"
            name="arrow-back"
            size={20}
            color="white"
          />
        </TouchableOpacity>
      </Div>
      <Spacer height={20} />
      <ScrollView
        style={styles.scrollView}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {transactions.map((transaction) => (
          <TransactionItem
            key={`${transaction.type}-${transaction.id}`}
            transaction={transaction}
          />
        ))}
        {loading && (
          <Div style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors[colorScheme].tint} />
            <Span style={styles.loadingText}>در حال بارگذاری...</Span>
          </Div>
        )}
        {!hasMore && transactions.length > 0 && (
          <Div style={styles.endContainer}>
            <Span style={styles.endText}>تمام تراکنش‌ها نمایش داده شد</Span>
          </Div>
        )}
        {transactions.length === 0 && !loading && (
          <Div style={styles.emptyContainer}>
            <Span style={styles.emptyText}>هیچ تراکنشی یافت نشد</Span>
          </Div>
        )}
      </ScrollView>
    </Mother>
  );
}

const styles = StyleSheet.create({
  container: {
    direction: "rtl",
    display: "flex",
  },
  Header: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 30,
    paddingTop: 18,
  },
  headerTitle: {
    height: "100%",
    verticalAlign: "middle",
    fontSize: 18,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  loadingContainer: {
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  endContainer: {
    alignItems: "center",
    padding: 20,
  },
  endText: {
    fontSize: 16,
    color: "#888",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    color: "#888",
  },
});

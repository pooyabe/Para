import {
  Date,
  Div,
  IconSymbol,
  Mother,
  Select,
  Spacer,
  Span,
} from "@/components/Elements";
import TransactionItem from "@/components/pageParts/reportsPage/TransactionItem";
import { Colors } from "@/constants/Colors";
import { useTransactionsList } from "@/hooks/BackEnd/Pages/useTransactionsList";
import { useColorScheme } from "@/hooks/useColorScheme";
import { router } from "expo-router";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

export default function TransactionsList() {
  const colorScheme = useColorScheme() as "light" | "dark";
  const colors = Colors[colorScheme];

  const {
    transactions,
    loading,
    hasMore,
    selectedDate,
    selectDate,
    categoryOptions,
    selectedCategory,
    selectCategory,
    refresh,
    handleScroll,
    handleDeleteTransaction,
  } = useTransactionsList();

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
            color={colors.text}
          />
        </TouchableOpacity>
      </Div>
      <Spacer height={15} />

      {/* Date Selector */}
      <Div style={styles.dateSelector}>
        <Date
          SelectedDate={selectedDate}
          onDateChange={(date: string) => {
            selectDate(date);
          }}
          style={{}}
        />
      </Div>

      <Spacer height={15} />

      {/* Category Selector */}
      <Div style={styles.categorySelector}>
        <Select
          label="دسته‌بندی"
          placeholder="همه تراکنش‌ها"
          items_array={categoryOptions}
          value={selectedCategory}
          onValueChange={(value: string) => {
            selectCategory(value);
          }}
          allowCustomItem={false}
          searchable
          searchPlaceholder="جستجو در دسته‌ها"
          modalTitle="نمایش بر اساس دسته‌بندی"
        />
      </Div>

      <Spacer height={15} />
      <ScrollView
        style={styles.scrollView}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {transactions.map((transaction) => (
          <TransactionItem
            key={`${transaction.type}-${transaction.id}`}
            transaction={transaction}
            onDelete={handleDeleteTransaction}
            onRefresh={refresh}
          />
        ))}
        {loading && (
          <Div style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.tint} />
            <Span style={styles.loadingText}>در حال بارگذاری...</Span>
          </Div>
        )}
        {!hasMore && transactions.length > 0 && (
          <Div style={styles.endContainer}>
            <Span style={[styles.endText, { color: colors.muted }]}>
              تمام تراکنش‌ها نمایش داده شد
            </Span>
          </Div>
        )}
        {transactions.length === 0 && !loading && (
          <Div style={styles.emptyContainer}>
            <Span style={[styles.emptyText, { color: colors.muted }]}>
              هیچ تراکنشی یافت نشد
            </Span>
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
  dateSelector: {
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  categorySelector: {
    paddingHorizontal: 20,
    paddingTop: 6,
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
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
  },
});

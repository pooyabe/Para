import { Div, IconSymbol, Mother, Spacer, Span } from "@/components/Elements";
import { router } from "expo-router";
import { ScrollView, StyleSheet, TouchableOpacity } from "react-native";

import { OveralLineChart } from "@/components/pageParts/reportsPage/OveralLineChart";
import { SpendingsPieChart } from "@/components/pageParts/reportsPage/SpendingsPieChart";
import { TopDateButtons } from "@/components/pageParts/reportsPage/TopDateButtons";

export default function ReportPage() {
  return (
    <Mother style={styles.container} _Hpadding={0}>
      <Div style={styles.Header}>
        <Span type="title" style={styles.headerTitle}>
          گزارش وضعیت
        </Span>
        <TouchableOpacity
          onPress={() => {
            router.replace("/(tabs)/spending");
          }}
        >
          <IconSymbol type="Ionicons" name="home" size={24} color="white" />
        </TouchableOpacity>
      </Div>
      <Spacer height={30} />
      <Div style={styles.dateButtonGroup}>
        {/****
         *
         * Import top date buttons
         *
         **/}
        <TopDateButtons />
        {/****
         *
         * ! Import top date buttons
         *
         **/}
      </Div>
      <Spacer height={20} />
      <ScrollView
        style={styles.bottomSection}
        overScrollMode="always"
        fadingEdgeLength={80}
      >
        {/****
         *
         *
         * Import Chart Components from Comonents/PageParts/ReportPage
         *
         *
         **/}
        <OveralLineChart />

        <SpendingsPieChart />

        <Span type="subtitle" style={{ textAlign: "center", marginTop: 60 }}>
          چارت‌های دیگر به زودی...
        </Span>
      </ScrollView>
    </Mother>
  );
}

const styles = StyleSheet.create({
  container: {
    direction: "rtl",
    display: "flex",
  },

  // Header section
  Header: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 30,
    paddingTop: 30,
  },
  headerTitle: {
    height: "100%",
    verticalAlign: "middle",
    fontSize: 24,
  },

  // Select date buttons
  dateButtonGroup: {
    paddingVertical: 10,
    paddingHorizontal: 30,
  },

  // The Bottom Section of data
  bottomSection: {
    flex: 1,
  },
});

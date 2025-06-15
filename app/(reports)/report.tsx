import { Div, IconSymbol, Mother, Spacer, Span } from "@/components/Elements";
import { router } from "expo-router";
import { StyleSheet, TouchableOpacity } from "react-native";

export default function ReportPage() {
  return (
    <Mother style={styles.container}>
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
      <Spacer />
    </Mother>
  );
}

const styles = StyleSheet.create({
  container: {
    direction: "rtl",
  },
  Header: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 40,
  },
  headerTitle: {
    height: "100%",
    verticalAlign: "middle",
    fontSize: 24,
  },
});

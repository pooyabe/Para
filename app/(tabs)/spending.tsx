import { Div } from "@/components/Div";
import { Input } from "@/components/Input";
import { Mother } from "@/components/Mother";
import { StyleSheet } from "react-native";

export default function HomeScreen() {
  return (
    <Mother>
      <Div style={styles.container}>
        <Input label="مبلغ خرید" type="number" />
      </Div>
    </Mother>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

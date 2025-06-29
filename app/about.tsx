import { Div, Mother, Span } from "@/components/Elements";
import { Dimensions, Image, StyleSheet } from "react-native";

const screenWidth = Dimensions.get("screen").width;
const screenHeight = Dimensions.get("screen").height;
export default function aboutPage() {
  return (
    <Mother style={styles.container} _Hpadding={0}>
      <Div style={styles.headImage}>
        <Image
          source={require("@/assets/images/icon.png")}
          style={styles.topImage}
        />
      </Div>
      <Div>
        <Span type="title" style={styles.titleSpan}>
          پارا
        </Span>
      </Div>
    </Mother>
  );
}

const styles = StyleSheet.create({
  container: {
    direction: "rtl",
    display: "flex",
  },
  headImage: {
    width: screenWidth,
    height: screenHeight * 0.2,
  },
  topImage: {
    height: "100%",
    width: "auto",
    objectFit: "contain",
  },

  titleSpan: {
    textAlign: "center",
    fontSize: 30
  }
});

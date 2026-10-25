import { Dimensions, Image, TouchableOpacity } from "react-native";
import { Div, Span } from "../Elements";

import { router } from "expo-router";

export function TabsHeader() {
  const ScreenHeight = Dimensions.get("screen").height;

  return (
    <Div
      style={{
        flexDirection: "row",
        alignItems: "center",
        margin: 0,
        paddingTop: ScreenHeight * 0.06,
        paddingHorizontal: 35,
        direction: "rtl",
        height: "auto",
        display: "flex",
        columnGap: 10,
      }}
    >
      <TouchableOpacity
        onPress={() => router.navigate("/about")}
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          paddingLeft: 20,
        }}
      >
        <Image
          source={require("@/assets/images/icon.png")}
          alt="Para"
          style={{
            width: 50,
            height: 50,
            borderRadius: 8,
            objectFit: "cover",
          }}
        />
        <Span type="title" style={{ fontSize: 25, fontWeight: "normal" }}>
          پارا
        </Span>
      </TouchableOpacity>
    </Div>
  );
}
